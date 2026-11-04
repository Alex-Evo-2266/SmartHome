# API Automation V4

## Связанные разделы

[README](./README.md) · [Архитектура](./architecture.md) · [Схема](./schema.md) · [Выражения](./expressions.md) · [Хранилище](./storage.md) · [Frontend](./frontend.md) · [Ошибки](./error-handling.md)

## Общий префикс

Router объявляет endpoints под `/api-devices/automation-v4`. В таблице приведены пути router-а; deployment может добавлять общий prefix приложения.

| Метод | Путь | Назначение |
|---|---|---|
| `GET` | `/api-devices/automation-v4/` | Отсортированный список текущих записей manager-а как `list[AutomationSchema]` (не чтение каталога на каждый запрос). |
| `POST` | `/api-devices/automation-v4/` | Тело `AutomationSchema`; создание, сохранение и регистрация в manager; ответ `AutomationSchema`, HTTP 201. |
| `GET` | `/api-devices/automation-v4/{automation_id}` | Получить схему из manager-а; 404, если отсутствует. |
| `PUT` | `/api-devices/automation-v4/{automation_id}` | Тело `AutomationSchema`; URL ID должен совпасть с body `id`; сохранение/обновление manager-а; ответ схема. |
| `DELETE` | `/api-devices/automation-v4/{automation_id}` | Удалить файл и запись manager-а; 204 без тела или 404, если нет записи ни в manager-е, ни в storage. |
| `POST` | `/api-devices/automation-v4/{automation_id}/run` | Без request body; ожидает `run_adapter`; ответ `{"message":"Автоматизация запущена","id":"..."}`. |
| `GET` | `/api-devices/automation-v4/action_commands` | Список доступных команд `list[DeviceCommand]` с параметрами. |
| `GET` | `/api-devices/automation-v4/expression-capabilities` | Метаданные поддерживаемых возможностей Expression Engine. |

Router prefix — `/api-devices/automation-v4`; список путей выше включает router path. В `GET /` возвращаются активные записи manager-а, а не файлы, прочитанные напрямую. Точный формат объекта CRUD-запроса — `AutomationSchema`. Не следует отправлять свободные дополнительные поля: схема использует `extra="forbid"`.

## Ответы метаданных

`action_commands` предназначен редактору для получения списка доступных команд; описание команды включает имя, title/description, target и `parameters` с name/title/data_type/required/description.

`expression-capabilities` возвращает объект с верхнеуровневыми ключами `types`, `operators`, `functions`, `argument_types`. В нём представлены формы узлов AST, операции/функции, типы аргументов, примеры и validation metadata; описание функций содержит аргументы, arity, результат и eager/lazy признак. Endpoint отдаёт deep copy метаданных.

`DeviceCommand` содержит обязательные `name`, `title`, `target` и необязательные `description`, `parameters` (по умолчанию пустой список). Каждый `CommandParameter` содержит обязательные `name`, `title`; `data_type` из `number|string|boolean|any|path` (default `any`), `required` (default `true`) и необязательное `description`.

В `Target` есть дефект объявления enum: `DEVICE="device"` и `FIELD_DEVICE="field"` — строковые значения, но `SYSTEM="system",` и `ROOM="room",` из-за завершающей запятой становятся одноэлементными tuple. Встроенный `set_value` описан с `Target.FIELD_DEVICE` и параметрами `path`/`value`. Это отмечено как фактическая особенность модели; не следует выводить значения из предполагаемого контракта.

В backend нет V4 enable/disable route. `EnableSchema` существует, но router его не использует. Frontend hook вызывает `PATCH /{id}/enable` — этот вызов не соответствует backend и не должен считаться рабочим.

## Создание и ошибки

- Создание проверяет безопасный YAML-совместимый `id` и отклоняет дубликаты.
- Обновление требует совпадения `{id}` и `AutomationSchema.id`.
- При POST некорректный/небезопасный ID приводит к 422, дубликат в manager/storage — 409, storage error — 500. PUT mismatch — 422; отсутствующая автоматизация — 404. Ошибки run возвращаются как 500.
- Получение отдельной автоматизации защищено `auth_privilege_dep("automation")`; зависимости авторизации на list, action commands, create, update, delete и run в этом router закомментированы.
- Ручной запуск не равен срабатыванию триггера: endpoint вызывает runner напрямую. Несмотря на текст `"Автоматизация запущена"`, handler ожидает выполнение `run_adapter`.
- Не существует enable route; `is_enabled` также не фильтруется manager-ом при индексировании/запуске.

## Known Issues

- Frontend вызывает PATCH `/{id}/enable`; backend endpoint отсутствует.
- API auth dependencies не единообразны: только GET одной схемы задаёт privilege dependency в текущем router.
- `GET /` основан на in-memory manager и может отражать активную runtime-регистрацию, а не полный список файлов, если manager и storage расходятся.

## Связь с backend

Router использует `AutomationSchema`, `AutomationStorage`, manager/runner и командный реестр. Runtime trigger и storage описаны в [triggers.md](./triggers.md), [storage.md](./storage.md) и [architecture.md](./architecture.md); соответствие UI API — в [frontend.md](./frontend.md).
