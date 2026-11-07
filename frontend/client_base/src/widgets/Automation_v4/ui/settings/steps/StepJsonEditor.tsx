import { useState } from "react";
import type { AutomationStep } from "@src/entites/automation_v4";
import { JsonContainer } from "alex-evo-sh-ui-kit";

interface StepJsonEditorProps {
  title: string;
  step: AutomationStep;
  onChange: (step: AutomationStep) => void;
  onDelete: () => void;
}

export function StepJsonEditor({
  title,
  step,
  onChange,
  onDelete,
}: StepJsonEditorProps) {
  const [draft] = useState(() =>
    JSON.stringify(step, null, 2),
  );
  const [error, setError] = useState<string | null>(null);

  function applyChanges() {
    try {
      const value: unknown = JSON.parse(draft);

      if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
      ) {
        throw new Error("Ожидался JSON-объект.");
      }

      const candidate = value as AutomationStep;

      if (candidate.type !== step.type) {
        throw new Error(
          "Нельзя менять тип шага через JSON-редактор.",
        );
      }

      onChange(candidate);
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось разобрать JSON.",
      );
    }
  }

  return (
    <div className="automation-settings">
      <div className="automation-settings__header">
        <span className="automation-editor__eyebrow">
          НАСТРОЙКИ ШАГА
        </span>

        <h2>{title}</h2>

        <p>
          Временная форма редактирования. Позже она будет заменена
          на типизированные поля этого шага.
        </p>
      </div>

      <section className="automation-settings__section">



        <JsonContainer name="step" data={JSON.parse(draft)} readonly/>

        {error && (
          <p className="automation-settings__error">{error}</p>
        )}

        <button
          type="button"
          className="automation-button automation-button--primary"
          onClick={applyChanges}
        >
          Применить изменения
        </button>
      </section>

      <div className="automation-settings__footer">
        <button
          type="button"
          className="automation-button automation-button--danger"
          onClick={onDelete}
        >
          Удалить шаг
        </button>
      </div>
    </div>
  );
}