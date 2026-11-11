
import type { ExpressionArgWithNull } from "@src/entites/automation_v4";
import { Typography } from "alex-evo-sh-ui-kit";
import { getConditionLabel } from "../shared/expressionPreview";
import "./TriggerConditionField.scss";

interface TriggerConditionFieldProps {
  value: ExpressionArgWithNull;
  onEdit: () => void;
  onRemove: () => void;
}

export function TriggerConditionField({
  value,
  onEdit,
  onRemove,
}: TriggerConditionFieldProps) {
  const preview = getConditionLabel(value);

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
