# Frontend Automation V4

## Связанные разделы

[README](./README.md) · [Схема backend](./schema.md) · [Триггеры](./triggers.md) · [Шаги](./steps.md) · [Expressions](./expressions.md) · [Пути](./path-resolution.md) · [API](./api.md) · [Ошибки](./error-handling.md)

## Расположение и основные модули

V4 UI находится в `frontend/client_base/src`:

| Путь | Роль |
|---|---|
| `entites/automation_v4/models/automation.ts` | TypeScript-модель Automation, trigger, step, expression и аргументов. |
| `entites/automation_v4/api/useAutomationAPI.ts` | API hook-ы для CRUD и enable endpoint. |
| `widgets/Automation_v4/ui/AutomationEditor.tsx` | Локальный редактор графа, выбор/редактирование узлов и callbacks. |
| `widgets/Automation_v4/ui/flow/AutomationFlow.tsx` | Представление flow/узлов. |
| `widgets/Automation_v4/ui/settings/AutomationSettingsPanel.tsx` | Настройки старта либо выбранного шага. |
| `widgets/Automation_v4/ui/settings/TriggerEditor.tsx` | Добавление, удаление и редактирование триггеров. |
| `widgets/Automation_v4/ui/settings/FunctionArgumentsEditor.tsx` | Редактирование параметров автоматизации. |
| `widgets/Automation_v4/ui/selectFields/useObjectMap.ts` | Построение дерева доступных device/room/variable/system путей. |
| `widgets/Automation_v4/ui/selectFields/PathSelector/` | Пошаговый выбор и проверка пути. |
| `widgets/Automation_v4/ui/settings/steps/` | Редакторы разных типов шагов. |
| `pages/AutomationEditor/ui/AutomationEditor.tsx` | Загрузка automation по ID и встраивание widget editor. |

Legacy-модуль `entites/automation/` обращается к `/api-devices/automation` отдельно; он не является V4-клиентом.

## TypeScript-модель и backend-соответствие

Клиентский корневой `Automation` включает `schema_version`, `id`, `name`, `description`, `trigger`, `parameters`, `entry`, `steps`, `expressions`, `is_enabled` — те же концептуальные поля, что `AutomationSchema`.

| Frontend-модель | Backend-сущность |
|---|---|
| `Automation` | `AutomationSchema` |
| `AutomationTrigger` | `Trigger` (`DeviceTrigger`, `RoomTrigger`, time union) |
| `AutomationStep` | `Step` |
| `ActionStep` / `ConditionStep` / `AwaitStep` / `ScriptActionStep` | соответствующие Pydantic step модели |
| `ExpressionArg` и expression node interfaces | `ExpressionArg` и `Expression` |
| parameter definition | `ScriptParameter` / `ParameterDefinition` |

Frontend-модель ориентирована на редактирование, а не на полную серверную валидацию. Параметрические и operator unions дублируют backend-контракт вручную; при изменении схемы требуется синхронное обновление и проверка обеих сторон. Нельзя считать TS-тип runtime-валидацией API payload.

## API hooks

`useAutomationAPI.ts` формирует вызовы на `/api-devices/automation-v4`:

- GET список/одна автоматизация;
- POST создание;
- PUT обновление;
- DELETE удаление;
- PATCH `/{id}/enable` для enable/disable.

В исследованном API hook нет вызовов `action_commands` и `expression-capabilities`; полноценный Expression editor/command-metadata flow не подключён. Backend предоставляет эти discovery endpoints отдельно. Backend CRUD и metadata API описаны в [api.md](./api.md).

## Редактор, триггеры и параметры

Widget editor держит текущую модель в локальном состоянии, меняет её через `onChange`, позволяет выбирать узлы, добавлять/удалять шаги и очищает ссылки на удалённый шаг в `next`, `on_true`, `on_false`, `on_timeout`. Панель настроек показывает редактор стартовой конфигурации либо выбранного шага.

`TriggerEditor` создаёт device, room и time триггеры. В time UI выбираются `weekly`, `once`, `monthly`, `interval`; значения даты и времени конвертируются через локальные helper-ы. Device selector разбирает путь на device/field, room selector — room/type/field. Это клиентская форма; фактическая поддержка scheduler-а определяется [backend-триггерами](./triggers.md).

`FunctionArgumentsEditor` редактирует пользовательские параметры `string`, `number`, `boolean`, `time`, `path`, включая создание, переименование, удаление и default. Значения хранятся в модели `parameters`.

## Выбор путей и ресурсов

Доступные устройства берутся из app Redux state, комнаты — из room hook. `useObjectMap` строит namespaces `device`, `room`, `variable`, `system`. Общие object-map helpers хранят структуру узлов и metadata. `usePathSelector` сопоставляет сегменты с map, считает уровни и определяет `isValid`; UI показывает доступные уровни через SelectField.

Action editor сохраняет выбранный путь как `params.path = {type: "path", path}`. Backend трактует `params.path` специально как адрес для действия; см. [path-resolution.md](./path-resolution.md) и [step-action.md](./step-action.md).

Frontend не получает актуальные устройства и комнаты через отдельный Automation V4 discovery endpoint: данные объединяются из общего state/hooks.

## Сериализация, загрузка и сохранение

Page-level editor загружает автоматизацию по ID через `getAutomation(id)`, затем передаёт объект виджету; локальные изменения формируют новый объект/patch. `StepJsonEditor` форматирует выбранный шаг через `JSON.stringify` и принимает JSON-объект, если JSON валиден, это не массив и `candidate.type` не поменялся.

**Критическое ограничение текущего UI:** page и список передают `onSave` как пустую функцию; `addAutomation`/`editAutomation` hooks не подключены к фактическому editor save path. Следовательно, изменения редактора остаются локальными и UI не сохраняет их в backend через обычную кнопку Save.

В list/editor wrapper также передаётся stub `createStep`, который возвращает `{}` с cast к `AutomationStep`; фабрика `createAutomationStep` существует отдельно, но в этой page flow не подключена.

## Редакторы шагов и выражений

`ActionStepEditor` — единственный редактор шага с реальной интеграцией path selector. Редакторы delay, condition, await и script используют временный `StepJsonEditor`, а не полноценные типизированные формы. Хотя TypeScript-модели включают expression node-и, полноценный визуальный Expression builder и сквозной Expression validation/save pipeline не реализованы в исследованном UI flow.

## Валидация и отображение ошибок

- Полной frontend-валидации `Automation` против backend-схемы нет.
- JSON editor проверяет parse/object/same-type и показывает локальное сообщение.
- Path selector проверяет существование узла и допустимую глубину.
- Переименование параметра запрещает пустой/дублирующий key.
- Несколько error/debug paths используют `console`/`console.error`; единого отображения server-side validation errors в сохранении нет, поскольку фактическое сохранение не подключено.

## Known Issues

Frontend содержит `PATCH /{id}/enable`, но backend V4 router не объявляет этот endpoint. `EnableSchema` существует в backend-модели, однако не используется этим router-ом. Backend manager также не фильтрует запуск по `is_enabled`. Нельзя считать UI-переключатель рабочей backend-функцией.

Для точного поведения backend сверяйтесь с [api.md](./api.md); ограничения runtime описаны в [steps.md](./steps.md) и [triggers.md](./triggers.md).
