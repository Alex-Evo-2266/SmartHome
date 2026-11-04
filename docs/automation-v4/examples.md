# Практические примеры

## Связанные разделы

[README](./README.md) · [Схема](./schema.md) · [Триггеры](./triggers.md) · [Шаги](./steps.md) · [Expressions](./expressions.md) · [Variables](./variables.md) · [Действия](./step-action.md) · [Ожидание](./step-await.md) · [Условия](./conditions.md)

## 1. Простой триггер устройства

```json
{
  "id":"device-trigger-example",
  "name":"Триггер устройства",
  "trigger":[{"type":"device","device":"hall_switch","field":"state"}],
  "entry":"done",
  "steps":{"done":{"type":"action","command":"set_value","params":{
    "path":{"type":"path","path":"device.hall_light.state"},
    "value":{"type":"literal","value":true,"data_type":"boolean"}
  }}}
}
```

При patch поля `state` на устройстве manager вызывает runner. Примечание: device trigger `condition` если задан, сейчас не применяется; имена ресурсов должны существовать в развернутой системе.

## 2. Триггер времени

```json
{
  "id":"weekly-trigger-example",
  "name":"Еженедельный запуск",
  "trigger":[{"type":"time","kind":"weekly","at":"22:30","weekdays":[0,4]}],
  "entry":"wait",
  "steps":{"wait":{"type":"delay","duration":{"type":"literal","value":60,"data_type":"number"}}}
}
```

Менеджер индексирует выбранные дни и время с минутной проверкой. Здесь `delay` запускается после time-trigger, затем проход приостанавливается через APScheduler. Время/дни описаны в [triggers.md](./triggers.md).

## 3. Триггер комнаты

```json
{
  "id":"room-trigger-example",
  "name":"Событие в комнате",
  "trigger":[{"type":"room","room":"living_room","device_type":"light","field":"state"}],
  "entry":"finish",
  "steps":{"finish":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}}}
}
```

Room patch сопоставляется по room/type/field. Trigger condition не фильтруется текущим runtime.

## 4. Несколько последовательных шагов

```json
{
  "id":"multi-step-example",
  "name":"Несколько шагов",
  "trigger":[],
  "entry":"first",
  "steps":{
    "first":{"type":"delay","duration":{"type":"literal","value":2,"data_type":"number"},"next":"second"},
    "second":{"type":"action","command":"set_value","params":{
      "path":{"type":"path","path":"device.hall_light.state"},
      "value":{"type":"literal","value":false,"data_type":"boolean"}
    }}
  }
}
```

Delay ставит продолжение на `next`; после паузы запускается второй шаг. Пустой trigger допустим моделью, но такой сценарий автоматически не сработает без ручного запуска/другого механизма.

## 5. `ActionStep`

```json
{
  "id":"action-example",
  "name":"Установить значение",
  "trigger":[],
  "entry":"set",
  "steps":{"set":{"type":"action","command":"set_value","params":{
    "path":{"type":"path","path":"device.hall_light.brightness"},
    "value":{"type":"literal","value":35,"data_type":"number"}
  }}}
}
```

Runner сохраняет path-строку именно у `params.path`, затем вызывает `device_action_handler("set_value", params)`. Существование поля и его допустимость определяются системой устройств.

## 6. `AwaitStep`

```json
{
  "id":"await-example",
  "name":"Продолжить при событии",
  "trigger":[],
  "entry":"wait",
  "steps":{
    "wait":{"type":"await","trigger":{"type":"device","device":"hall_sensor","field":"state"},
      "timeout":{"type":"literal","value":300,"data_type":"number"},
      "next":"after_event","on_timeout":"timed_out"},
    "after_event":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}},
    "timed_out":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}}
  }
}
```

Runner регистрирует одноразовую подписку и timeout, затем приостанавливает проход. При событии продолжает с `next`; при timeout — с `on_timeout`. **Ограничение:** event callback не оценивает `trigger.condition`; если `next` отсутствует/пустой, ни подписка, ни timeout не ставятся. См. [step-await.md](./step-await.md).

## 7. Условное ветвление

```json
{
  "id":"condition-example",
  "name":"Ветвление",
  "trigger":[],
  "entry":"check",
  "expressions":{"is_dark":{"type":"binary","op":"lt",
    "left":{"type":"path","path":"device.room_sensor.illuminance"},
    "right":{"type":"literal","value":20,"data_type":"number"}}},
  "steps":{
    "check":{"type":"condition","condition":{"type":"ref","ref":"is_dark"},
      "on_true":"turn_on","on_false":"turn_off"},
    "turn_on":{"type":"action","command":"set_value","params":{
      "path":{"type":"path","path":"device.hall_light.state"},
      "value":{"type":"literal","value":true,"data_type":"boolean"}},
      "next":"end"},
    "turn_off":{"type":"action","command":"set_value","params":{
      "path":{"type":"path","path":"device.hall_light.state"},
      "value":{"type":"literal","value":false,"data_type":"boolean"}},
      "next":"end"},
    "end":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}}
  }
}
```

`ConditionStep` выбирает ровно `on_true` или `on_false`; поле `next` не является fallback. Ветка завершения задана отдельными `next` у действий.

## 8. Expression

```json
{
  "id":"expression-example",
  "name":"Сравнение",
  "trigger":[],
  "entry":"check",
  "expressions":{"is_warm":{"type":"binary","op":"gte",
    "left":{"type":"path","path":"device.room_sensor.temperature"},
    "right":{"type":"literal","value":24,"data_type":"number"}}},
  "steps":{"check":{"type":"condition","condition":{"type":"ref","ref":"is_warm"},
    "on_true":"hot","on_false":"cool"},
    "hot":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}},
    "cool":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}}}
}
```

Выражение сравнивает прочитанное значение с числом. Тип runtime значения зависит от типа поля устройства.

## 9. Пользовательский параметр и переменная

```json
{
  "id":"variable-example",
  "name":"Числовой параметр в выражении",
  "parameters":{"threshold":{"title":"Порог","required":true,
    "definition":{"type":"number","default":20}}},
  "trigger":[],
  "entry":"check",
  "expressions":{"above_threshold":{"type":"binary","op":"gte",
    "left":{"type":"path","path":"device.room_sensor.temperature"},
    "right":{"type":"path","path":"variable.threshold"}}},
  "steps":{"check":{"type":"condition","condition":{"type":"ref","ref":"above_threshold"},
    "on_true":"above","on_false":"below"},
    "above":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}},
    "below":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}}}
}
```

Context наполняет `threshold` из default, а `variable.threshold` возвращает значение параметра, используемое в правой части сравнения. Если параметр содержит строку, распознаваемую как путь, resolver может рекурсивно её раскрыть; различие между значением и path-адресом описано в [variables.md](./variables.md).

## 10. Составной сценарий

```json
{
  "id":"combined-example",
  "name":"Событие, условие, действие и задержка",
  "trigger":[{"type":"device","device":"hall_switch","field":"state"}],
  "parameters":{"threshold":{"title":"Порог","required":true,
    "definition":{"type":"number","default":20}}},
  "expressions":{
    "low_light":{"type":"binary","op":"lt",
      "left":{"type":"path","path":"device.room_sensor.illuminance"},
      "right":{"type":"path","path":"variable.threshold"}}
  },
  "entry":"check",
  "steps":{
    "check":{"type":"condition","condition":{"type":"ref","ref":"low_light"},
      "on_true":"enable","on_false":"skip"},
    "enable":{"type":"action","command":"set_value","params":{
      "path":{"type":"path","path":"device.hall_light.state"},
      "value":{"type":"literal","value":true,"data_type":"boolean"}},
      "next":"pause"},
    "pause":{"type":"delay","duration":{"type":"literal","value":30,"data_type":"number"},
      "next":"disable"},
    "disable":{"type":"action","command":"set_value","params":{
      "path":{"type":"path","path":"device.hall_light.state"},
      "value":{"type":"literal","value":false,"data_type":"boolean"}},
      "next":"end"},
    "skip":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"},
      "next":"end"},
    "end":{"type":"delay","duration":{"type":"literal","value":1,"data_type":"number"}}
  }
}
```

Это объединяет device trigger, параметр по умолчанию, переменную, binary expression, condition, действия и delay. Условия trigger-а тут нет: если оно будет добавлено, текущий patch callback его не применит. Устройство, поля и числовые значения должны быть доступны в конкретной инсталляции.

## Не поддерживаемые сценарии

- Запуск `ScriptActionStep` (type `script`) из runner не реализован.
- Автоматический запуск по `IntervalTimeTrigger` не реализован в manager.
- Примеры не обещают поведение `AwaitStep` как polling/ожидания истинности выражения; фактическое событие-driven ограничение описано выше.
