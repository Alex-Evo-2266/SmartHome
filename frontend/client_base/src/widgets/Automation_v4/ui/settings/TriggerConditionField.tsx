
import type { ExpressionArgWithNull } from "@src/entites/automation_v4";
import { Typography } from "alex-evo-sh-ui-kit";
import "./TriggerConditionField.scss";

interface TriggerConditionFieldProps {
  value: ExpressionArgWithNull;
  onEdit: () => void;
  onRemove: () => void;
}

function getConditionPreview(value: ExpressionArgWithNull) {
  if (!value) {
    return {
      type: "Не задано",
      title: "Условие отсутствует",
      description: "Нажмите, чтобы добавить условие срабатывания",
    };
  }

  switch (value.type) {
    case "literal":
      return {
        type: "Константа",
        title: String(value.value ?? "null"),
        description: "Постоянное логическое значение",
      };

    case "path":
      return {
        type: "Путь",
        title: value.path,
        description: "Значение из объекта системы",
      };

    case "ref":
      return {
        type: "Выражение",
        title: value.ref ? "Составное выражение" : "Выражение не выбрано",
        description: value.ref ? `ID: ${value.ref}` : "Необходимо выбрать выражение",
      };
  }
}

export function TriggerConditionField({
  value,
  onEdit,
  onRemove,
}: TriggerConditionFieldProps) {
  const preview = getConditionPreview(value);

  return (
    <div className="trigger-condition">
      <div className="trigger-condition__header">
        <div className="trigger-condition__heading">
          <Typography type="small">
            Условие срабатывания
          </Typography>

          <span className="trigger-condition__type">BOOLEAN</span>
        </div>

        {value && (
          <span className="trigger-condition__status">
            Настроено
          </span>
        )}
      </div>

      <div
        className={`trigger-condition__card ${
          value ? "trigger-condition__card--filled" : "trigger-condition__card--empty"
        }`}
      >
        <div className="trigger-condition__main" onClick={onEdit}>
          <div className="trigger-condition__icon">
            <span>{value ? "ƒ" : "+"}</span>
          </div>

          <div className="trigger-condition__content">
            <div className="trigger-condition__title">
              <Typography type="body">
                {preview.title}
              </Typography>

              {value && (
                <span className="trigger-condition__kind">
                  {preview.type}
                </span>
              )}
            </div>

            <Typography
              type="small"
              className="trigger-condition__description"
            >
              {preview.description}
            </Typography>
          </div>
        </div>

        <div className="trigger-condition__actions">
          {value && (
            <button
              type="button"
              className="trigger-condition__action trigger-condition__action--remove"
              onClick={onRemove}
              title="Удалить условие"
            >
              ×
            </button>
          )}

          <button
            type="button"
            className="trigger-condition__action trigger-condition__action--edit"
            onClick={onEdit}
            title={value ? "Изменить условие" : "Добавить условие"}
          >
            {value ? "Изменить" : "Настроить"}
          </button>
        </div>
      </div>
    </div>
  );
}
