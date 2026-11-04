# Ошибки и логирование

## Связанные разделы

[README](./README.md) · [Валидация](./validation.md) · [Выражения](./expressions.md) · [Пути](./path-resolution.md) · [Шаги](./steps.md) · [Хранилище](./storage.md) · [API](./api.md)

## Категории ошибок

| Уровень | Где возникает | Поведение |
|---|---|---|
| Pydantic validation | Разбор JSON/YAML, некорректный discriminator, поле/тип или ссылка | Не создаётся валидная `AutomationSchema`; API возвращает HTTP client error, storage оборачивает ошибку чтения/валидации. |
| Expression evaluation | Неизвестный ref/function, неверный оператор/тип, цикл, лимит глубины, деление на ноль | `ExpressionError`; в runner преобразуется в `StepExecutionError`. |
| Path resolution | Неизвестный namespace, отсутствующий ресурс/поле/переменная, некорректный путь | Ошибка resolver-а поднимается вызывающему шагу/выражению. |
| Step/command | Неизвестный тип шага, неизвестная команда, ошибка setter/handler-а | Runner прерывает текущий проход и поднимает ошибку шага. |
| Storage | Ошибка файловой операции, YAML parsing или model validation | `AutomationIOError`; API преобразует в HTTP error. |
| Trigger/runtime callback | Ошибки запуска из-за события, планировщика или runner | Возникают в callback path; API error mapping к ним не относится, если вызов асинхронный. |

## Ошибки выражений

Для обычного `CallExpr` исключения вызова функции оборачиваются в `ExpressionError` с названием функции. Ошибки рекурсии включают цепочку вычисления. Числовые comparison/arithmetic операции требуют конвертируемые значения; `div`/`mod` на ноль приводят к ошибке. Вызов неизвестной функции или ссылки не подменяется фиктивным значением.

## Ошибки исполнения

`AutomationRunner` логирует и повторно поднимает сбои action handler; `ExpressionError` заворачивается в `StepExecutionError`. Нормальный запуск завершается при отсутствии следующего шага, а не возвращает автоматически результат каждого действия как переменную.

Некоторые ошибки возникают вне HTTP request: триггерные callbacks и jobs планировщика запускают runner независимо, поэтому их нельзя считать обработанными CRUD endpoint-ом.

## Логирование

В коде используются logger-ы компонентов runner, storage, API, manager и action handler. При разборе проблемы сопоставляйте запись с соответствующим слоем; не выводите секреты или значения параметров в общие логи без проверки текущей конфигурации логирования.

## Known Issues

- В `ScriptActionStep` есть схема, но отсутствует обработчик в runner; выполнение даст ошибку неизвестного типа шага.
- `AwaitStep` может поставить событие и timeout одновременно; код события удаляет subscription, но не отменяет связанный timeout job. Timeout callback удаляет subscriptions и запускает `on_timeout`, если он задан.
- Условие `AwaitStep.trigger` не вычисляется при событии; при отсутствующем/пустом `next` не устанавливается ни subscription, ни timeout, даже если есть `on_timeout`.
- Device/room trigger condition игнорируется при событии.
- Ожидание с пустым/отсутствующим `next` не регистрирует ни event subscription, ни timeout, даже если `on_timeout` указан.
- `interval` trigger не поддержан manager-ом.

Эти пункты описывают текущее поведение, а не рекомендуемую семантику.
