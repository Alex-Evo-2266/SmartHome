# Шаг ожидания (`AwaitStep`)

## Связанные разделы

[README](./README.md) · [Шаги](./steps.md) · [Триггеры](./triggers.md) · [Условия](./conditions.md) · [Expressions](./expressions.md) · [Ошибки](./error-handling.md)

## Модель

```json
{
  "type": "await",
  "trigger": {
    "type": "device",
    "device": "hall_sensor",
    "field": "state"
  },
  "timeout": {"type":"literal","value":300,"data_type":"number"},
  "on_timeout": "timed_out",
  "next": "continued"
}
```

| Поле | Тип | Обязательное | Назначение |
|---|---|---:|---|
| `type` | literal `"await"` | да | Дискриминатор. |
| `trigger` | `Trigger` | да | Описание события, на которое оформляется ожидание. |
| `timeout` | `ExpressionArg \| null` | нет | Вычисляемый timeout. |
| `on_timeout` | `string \| null` | нет | Шаг при timeout. |
| `label` | `string \| null` | нет | UI-метка. |
| `next` | `string \| null` | нет | Переход после успешного продолжения, если он предусмотрен обработчиком. |

## Фактическая реализация

Runner `_run_await` регистрирует подписку через `manager.add_await_automation(...)` только если `step.next` задан и truthy; subscription сохраняет этот ID как `start_step`. Если timeout задан, вычисляет его в секунды и ставит timeout callback через APScheduler. Затем возвращает `None`, останавливая текущий проход. В коде присутствовала старая inline polling-реализация, но она закомментирована и не является runtime-поведением.

При совпадении события manager удаляет одноразовую подписку и запускает runner с сохранённого start step. Callback не вычисляет `item.cond`; поэтому `AwaitStep` **не гарантирует ожидание истинности condition**. При событии связанный timeout job не отменяется. Timeout callback удаляет subscriptions для автоматизации/шага и запускает `on_timeout`, только если он задан; иначе выполнение останавливается.

## Timeout и переходы

Timeout задаётся `ExpressionArg`; принимаются `timedelta`, числовое значение (кроме `bool`) либо числовая строка, далее переводимые в секунды. `on_timeout` — валидируемая ссылка на шаг. Если `next` отсутствует или пустой, не регистрируются ни event subscription, ни timeout, даже когда задан `on_timeout`.

## Known Issues

- Polling не работает: существующий polling код закомментирован.
- Условие trigger не вычисляется при возобновлении по событию.
- Интервальный trigger внутри `await` тоже не имеет поддержки в manager.
- При событии не отменяется поставленный timeout job; после продолжения с `next` timeout callback ещё может сработать.

Для надёжного понимания переходов сверяйте `_run_await` в `SmartHome/app/core/entities/automation/automation_v4.py` и соответствующий manager callback в `SmartHome/app/core/state/automation_store_v4.py`; эти ограничения являются архитектурными особенностями текущего кода, не исправленными в рамках документации.
