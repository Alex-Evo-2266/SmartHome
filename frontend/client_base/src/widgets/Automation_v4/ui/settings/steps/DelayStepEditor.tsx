
import { useState } from "react";

import type {
  Automation,
  AutomationStep,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { Button, Typography } from "alex-evo-sh-ui-kit";

import styles from "./StepSettingsHeader.module.scss";
import { useActionCommands } from "./ActionStepEditor/hooks/useActionCommands";
import { ExpressionBuilderModal } from "../../expressionBuilder/StartBlock";
import { useAutomationVariables } from "../../shared/useAutomationVariables";
import { getExpressionPreview } from "../../shared/expressionPreview";

interface Props {
  step: AutomationStep;
  parameters: Automation["parameters"];
  expressions: Automation["expressions"];

  onChange: (step: AutomationStep) => void;
  onDelete: () => void;

  onExpressionChange: (
    update: (
      expressions: Automation["expressions"],
    ) => Automation["expressions"],
  ) => void;
}

function isDelayStep(
  step: AutomationStep,
): step is Extract<AutomationStep, { type: "delay" }> {
  return step.type === "delay";
}

export function DelayStepEditor({
  step,
  parameters,
  expressions,
  onChange,
  onDelete,
  onExpressionChange,
}: Props) {
  const [isExpressionOpen, setIsExpressionOpen] = useState(false);

  const { capabilities } = useActionCommands();

  const variables = useAutomationVariables(parameters);

  if (!isDelayStep(step)) return null;

  const duration = step.duration ?? null;

  const updateDuration = (value: ExpressionArg) => {
    onChange({
      ...step,
      duration: value,
    });
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <Typography type="small" className={styles.eyebrow}>
              НАСТРОЙКИ ШАГА
            </Typography>

            <Typography type="title-2">
              Задержка
            </Typography>
          </div>

          <Button type="button" onClick={onDelete}>
            Удалить
          </Button>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gap: 12,
          padding: "12px 0",
        }}
      >
        <div>
          <Typography type="small">
            Продолжительность
          </Typography>

          <button
            type="button"
            onClick={() => setIsExpressionOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 12,
              padding: "12px",
              border: "1px solid var(--Outline-color)",
              borderRadius: 8,
              background: "var(--Surface-container-low-color)",
              color: "var(--On-surface-color)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span>
              {getExpressionPreview(duration, expressions, capabilities)}
            </span>

            <span>
              Изменить
            </span>
          </button>

          <Typography type="small">
            Значение указывается в секундах. Результат выражения должен быть числом.
          </Typography>
        </div>
      </div>

      {isExpressionOpen && (
        <ExpressionBuilderModal
          type="number"
          pathType={undefined}
          enum_vals={undefined}
          value={
            duration ?? {
              type: "literal",
              value: 1,
              data_type: "number",
            }
          }
          expressions={expressions}
          capabilities={capabilities}
          variables={variables}
          onChange={updateDuration}
          onExpressionsChange={onExpressionChange}
          onClose={() => setIsExpressionOpen(false)}
        />
      )}
    </>
  );
}
