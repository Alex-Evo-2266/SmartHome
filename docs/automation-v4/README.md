# Automation V4

## Связанные разделы

- [Архитектура](./architecture.md)
- [Схема автоматизации](./schema.md)
- [Триггеры](./triggers.md)
- [Expression Engine](./expressions.md)
- [Аргументы выражений](./expression-arguments.md)
- [Переменные](./variables.md)
- [Шаги](./steps.md)
- [Действия устройств](./step-action.md)
- [Ожидание](./step-await.md)
- [Условия](./conditions.md)
- [Разрешение путей](./path-resolution.md)
- [Контекст выполнения](./execution-context.md)
- [Валидация](./validation.md)
- [Хранилище](./storage.md)
- [API](./api.md)
- [Frontend](./frontend.md)
- [Ошибки и логирование](./error-handling.md)
- [Примеры](./examples.md)

## Назначение

Automation V4 — описываемый JSON/YAML граф автоматизации. Он состоит из метаданных сценария, триггеров, словаря шагов с переходами, выражений и параметров. Backend валидирует модель Pydantic, сохраняет автоматизации в YAML и запускает их через менеджер триггеров и `AutomationRunner`.

Это описание фиксирует фактическую реализацию в репозитории. Объявление поля в схеме не всегда означает, что оно исполняется: например, `ScriptActionStep` и интервальный триггер существуют в модели, но runtime-обработка для них отсутствует. Такие различия отмечены в соответствующих разделах.

## Краткая схема работы

1. Клиент загружает список автоматизаций и описания команд/выражений через API.
2. При сохранении backend разбирает запрос как `AutomationSchema`, проверяет форму и ссылки, затем записывает YAML.
3. V4 lifecycle загружает YAML, регистрирует автоматизации в `AutomationManager_V4`, подписывает менеджер на обновления устройств/комнат и запускает минутную проверку временных триггеров.
4. Менеджер вызывает runner для совпавшего триггера. Runner начинает с `entry` либо с переданного продолжения, вычисляет шаги и следует переходам.
5. Аргументы и выражения вычисляются в `AutomationContext`; действия передаются внедрённому `device_action_handler`.

Подробности: [архитектура](./architecture.md), [API](./api.md), [контекст выполнения](./execution-context.md).

## Важные ограничения текущей реализации

- `ScriptActionStep` присутствует в модели, но не исполняется runner-ом; `interval` проходит схему, но не планируется manager-ом.
- `AwaitStep` приостанавливает выполнение и ставит event subscription/timeout только при заданном `next`; callback не проверяет условие, а timeout не отменяется событием.
- Device/room trigger `condition` сейчас не фильтрует patch-события.
- Frontend V4 содержит локальный editor, но его Save handler и создание шагов на page flow заглушены; CRUD save hooks не подключены. Frontend PATCH enable endpoint отсутствует в backend, а backend не фильтрует `is_enabled`.

## Основные сущности

| Сущность | Назначение |
|---|---|
| `AutomationSchema` | Корневая модель автоматизации: метаданные, триггеры, параметры, точка входа, шаги и выражения. |
| `Trigger` | Описание события устройства/комнаты или расписания. |
| `Step` | Узел графа исполнения: задержка, действие, условие, ожидание или запуск сценария. |
| `Expression` | AST вычисляемого значения: бинарное/унарное выражение, вызов функции или группа. |
| `ExpressionArg` | Литерал, ссылка (`ref`) или путь (`path`), используемые выражениями и шагами. |
| `AutomationContext` | Переменные конкретного запуска, граф и кэши разрешения путей/выражений. |
| `AutomationManager_V4` | Индекс триггеров и связующее звено между изменениями состояния/планировщиком и runner. |
| `AutomationRunner` | Выполнение шагов по графу переходов. |
| `AutomationStorage` | Загрузка и атомарное сохранение YAML-файлов автоматизаций. |

## Содержание документации

| Файл | Содержание |
|---|---|
| [architecture.md](./architecture.md) | Компоненты, потоки данных и жизненный цикл, включая Mermaid-диаграммы. |
| [schema.md](./schema.md) | Поля корневой модели и вложенные структуры JSON/YAML. |
| [triggers.md](./triggers.md) | Типы триггеров и фактический механизм срабатывания. |
| [expressions.md](./expressions.md) | AST, операции, функции, правила вычисления и ошибки. |
| [expression-arguments.md](./expression-arguments.md) | Литералы, пути и ссылки, их разрешение. |
| [variables.md](./variables.md) | Параметры запуска, значения по умолчанию и `variable.*`. |
| [steps.md](./steps.md) | Граф шагов, переходы и обработка результатов. |
| [step-action.md](./step-action.md) | `ActionStep`, разрешение параметров и обработчик команд. |
| [step-await.md](./step-await.md) | `AwaitStep`, подписки и ограничения текущей реализации. |
| [conditions.md](./conditions.md) | `ConditionStep` и условия триггеров/ожидания. |
| [path-resolution.md](./path-resolution.md) | Пространства имён и алгоритм `resolve_path`. |
| [execution-context.md](./execution-context.md) | Контекст одного запуска, кэши и защита рекурсии. |
| [validation.md](./validation.md) | Проверки Pydantic и ссылочной целостности. |
| [storage.md](./storage.md) | YAML, атомарное сохранение и загрузка. |
| [api.md](./api.md) | HTTP endpoints Automation V4. |
| [frontend.md](./frontend.md) | UI, модели TypeScript и обмен с backend. |
| [error-handling.md](./error-handling.md) | Ошибки схемы, вычисления, запуска и хранилища. |
| [examples.md](./examples.md) | Примеры, соответствующие фактическим типам и формату проекта. |

## Порядок изучения

Новому разработчику рекомендуется начать с [архитектуры](./architecture.md), затем изучить [схему](./schema.md), [триггеры](./triggers.md) и [шаги](./steps.md). Для понимания вычислений прочитать [аргументы](./expression-arguments.md), [выражения](./expressions.md), [переменные](./variables.md) и [разрешение путей](./path-resolution.md). Затем перейти к [контексту](./execution-context.md), [валидации](./validation.md), [хранилищу](./storage.md), [API](./api.md) и [frontend](./frontend.md). Практические сценарии собраны в [examples.md](./examples.md), известные ограничения — в профильных разделах и [error-handling.md](./error-handling.md).

## Исходники

Основная реализация находится в `SmartHome/app/schemas/automation/automation_v4.py`, `SmartHome/app/core/entities/automation/`, `SmartHome/app/core/state/automation_store_v4.py`, `SmartHome/app/db/repositories/automation_v4/automation_io.py`, `SmartHome/app/api/automation/automation_v4.py` и frontend-модуле `frontend/client_base/src/entites/automation_v4/` вместе с редактором в `frontend/client_base/src/widgets/Automation_v4/`.
