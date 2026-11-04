# Триггеры

## Связанные разделы

[README](./README.md) · [Схема](./schema.md) · [Шаги](./steps.md) · [Условия](./conditions.md) · [API](./api.md) · [Архитектура](./architecture.md)

## Общая модель

`AutomationSchema.trigger` — список `Trigger`. Разрешены `DeviceTrigger`, `RoomTrigger` и временное объединение `TimeTrigger`. Триггерные объекты выбираются полем `type`; time-варианты имеют `type: "time"` и различаются полем `kind`.

Менеджер `AutomationManager_V4` строит индексы для временных триггеров и patch-событий устройств/комнат. При совпадении он вызывает callback запуска. Это не означает, что все схемно допустимые варианты подключены к runtime: см. ограничения ниже.

## Триггер устройства

Модель `DeviceTrigger`:

| Поле | Тип | Обязательное | Назначение |
|---|---|---:|---|
| `type` | literal `"device"` | да | Дискриминатор. |
| `device` | `string` | да | Идентификатор устройства (в runtime индексируется как имя устройства). |
| `field` | `string` | да | Имя поля устройства. |
| `condition` | `RefArg \| null` | нет | Ссылка-условие, допускаемая схемой. |

```json
{"type":"device","device":"hall_switch","field":"state"}
```

Менеджер сопоставляет обновления по паре `(device, field)`. В текущем `on_device_patch` условие `condition` не вычисляется (оставлен TODO в коде): фактическое срабатывание по patch не фильтруется этой ссылкой.

## Триггер комнаты

Модель `RoomTrigger`:

| Поле | Тип | Обязательное | Назначение |
|---|---|---:|---|
| `type` | literal `"room"` | да | Дискриминатор. |
| `room` | `string` | да | Имя комнаты. |
| `device_type` | `string` | да | Тип устройства. |
| `field` | `string` | да | Поле, за которым наблюдают. |
| `condition` | `RefArg \| null` | нет | Ссылка-условие, допускаемая схемой. |

```json
{"type":"room","room":"living_room","device_type":"light","field":"state"}
```

Runtime индексирует по `(room, device_type, field)`. Как и для device trigger, `condition` не применяется при обработке room patch.

## Временные триггеры

### `once`

| Поле | Тип | Обязательное | Назначение |
|---|---|---:|---|
| `type` | literal `"time"` | да | Общий тип. |
| `kind` | literal `"once"` | да | Вариант однократного запуска. |
| `run_at` | ISO datetime string | да | Момент запуска; валидатор требует timezone offset. |
| `timezone` | `string \| null` | нет | Дополнительное поле схемы; интерпретация runtime зависит от менеджера. |

```json
{"type":"time","kind":"once","run_at":"2026-01-15T22:30:00+03:00"}
```

Валидатор вызывает `datetime.fromisoformat` и отклоняет значение без часового пояса.

### `weekly`

`at` — строка времени (`HH:MM` или `HH:MM:SS` указаны в описании схемы); `weekdays` — обязательный список чисел 0–6, длина 1–7; `timezone`, `active_from`, `active_until` необязательны. Валидатор диапазона удаляет дубликаты и сортирует список. 0 — понедельник, 6 — воскресенье.

```json
{"type":"time","kind":"weekly","at":"22:30","weekdays":[0,4,6]}
```

Manager индексирует weekly по `(weekday, "HH:MM")`.

### `monthly`

Поля: `type: "time"`, `kind: "monthly"`, обязательные `at: string` и `month_days: list[int]`, необязательный `timezone: string|null`. Для `month_days` в модели не заданы дополнительные ограничения диапазона/длины.

```json
{"type":"time","kind":"monthly","at":"08:15","month_days":[1,15]}
```

Manager индексирует monthly по `(day_of_month, "HH:MM")`.

### `interval`

Поля: `type: "time"`, `kind: "interval"`, `interval: int`, `unit` из `seconds|minutes|hours|days`, необязательный `timezone`. Схема не задаёт ограничения на положительность `interval`.

```json
{"type":"time","kind":"interval","interval":15,"unit":"minutes"}
```

**Ограничение реализации:** этот вариант проходит модельную валидацию, но `AutomationManager_V4` не индексирует `IntervalTimeTrigger` и не создаёт для него расписание. Не рассчитывайте на его запуск.

## Регистрация и выполнение

При старте V4 lifecycle загружает YAML-автоматизации и передаёт их manager. Временные варианты `once`, `weekly`, `monthly` индексируются и проверяются минутной задачей; device/room запускаются callbacks состояния. Время в manager обрабатывается в индексах с минутной точностью. Запуск через API может обходить триггерный механизм.

## Known Issues

- `condition` у device/room trigger валиден, но не вычисляется в patch callback.
- `interval` объявлен в Pydantic, но отсутствует в регистрации/индексации manager.
- `AwaitStep` также содержит `Trigger`, однако его подписка не проверяет условие как ожидается; детали в [step-await.md](./step-await.md).
- Триггерный `condition` имеет тип именно `RefArg`, не произвольный `ExpressionArg`.
