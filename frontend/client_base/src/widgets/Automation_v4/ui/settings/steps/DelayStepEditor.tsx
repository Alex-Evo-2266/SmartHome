
import { useMemo, useState } from "react";

import type {
  Automation,
  AutomationStep,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { Typography } from "alex-evo-sh-ui-kit";

import styles from "./StepSettingsHeader.module.scss";
import { useActionCommands } from "./ActionStepEditor/hooks/useActionCommands";
import { useObjectMap } from "../../selectFields/useObjectMap";
import { ExpressionBuilderModal } from "../../expressionBuilder/StartBlock";

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

function getExpressionPreview(value: ExpressionArg | null): string {
  if (!value) return "Не задано";

  if (value.type === "literal") {
    return String(value.value);
  }

  if (value.type === "path") {
    return value.path;
  }

  if (value.type === "ref") {
    return value.ref ?? "";
  }

  return "Настроенное выражение";
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

  const variables = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(parameters ?? {}).map(([name, parameter]) => {
          const { type } = parameter.definition;

          return [
            name,
            {
              meta: {
                kind: "variable" as const,
                ...(type !== "path" && type !== "for_path"
                  ? { valueType: type }
                  : {}),
              },
            },
          ];
        }),
      ),
    [parameters],
  );

  const objectMap = useObjectMap({ variables });

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
        <Typography type="small" className={styles.eyebrow}>
          НАСТРОЙКИ ШАГА
        </Typography>

        <Typography type="title-2">
          Задержка
        </Typography>
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
              {getExpressionPreview(duration)}
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
