# Условия и ветвления

## Связанные разделы

[README](./README.md) · [Шаги](./steps.md) · [Expressions](./expressions.md) · [Аргументы](./expression-arguments.md) · [Триггеры](./triggers.md) · [Ожидание](./step-await.md)

## `ConditionStep`

Модель условия графа:

```json
{
  "type": "condition",
  "condition": {"type":"ref","ref":"is_dark"},
  "on_true": "turn_on",
  "on_false": "finish"
}
```

Поля: обязательные `type: "condition"` и `condition: ExpressionArg`; необязательные `on_true`, `on_false`, `label`, `next`. Корневой валидатор проверяет, что заданные переходы существуют. Runner разрешает условный аргумент, преобразует результат в bool через `to_bool`, затем выбирает переход `on_true` или `on_false`.

`condition` здесь один `ExpressionArg`, не отдельное дерево условий. Для составной логики создайте запись в `expressions`, например `GroupExpr` с `and`/`or`, или `BinaryExpr` сравнения, и используйте `RefArg`.

## Логика внутри Expression

Логические операции доступны как `UnaryExpr(op="not")`, `GroupExpr(op="and"|"or")` и функции, включая ленивый `if`. Они вычисляются Expression Engine, а не переходной логикой `ConditionStep`. Перечень и семантика см. в [expressions.md](./expressions.md).

## Условия триггеров

`DeviceTrigger.condition` и `RoomTrigger.condition` имеют тип `RefArg | null`. Они проходят ссылочную проверку схемы. Однако текущие `on_device_patch`/`on_room_patch` не вычисляют `item.cond` (есть TODO); событие вызывает запуск независимо от этого условия. Не считайте поле фильтром runtime, пока реализация не изменится.

## Условие в `AwaitStep`

`AwaitStep.trigger` использует общую модель `Trigger`; обработка события зарегистрирована, но callback не проверяет условие триггера. Это отдельное от `ConditionStep` поведение и описано в [step-await.md](./step-await.md).

## Ограничения ветвления

Схема проверяет существование ID переходов, но не проверяет полноту веток, достижимость узлов или замкнутые циклы. `next` присутствует в `ConditionStep`, но runner его не использует; переход выбирается по `on_true`/`on_false`. Лимит шагов runtime ограничивает число шагов за один проход.
