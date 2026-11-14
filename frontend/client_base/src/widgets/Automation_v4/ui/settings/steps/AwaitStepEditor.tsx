import type {
  Automation,
  AutomationStep,
  AwaitStep,
  ExpressionArg,
} from "@src/entites/automation_v4";
import { Button, Typography } from "alex-evo-sh-ui-kit";
import { useState } from "react";

import type { ExpressionBuilderModalProps } from "../../expressionBuilder/StartBlock";
import { ExpressionBuilderModal } from "../../expressionBuilder/StartBlock";
import { getExpressionPreview } from "../../shared/expressionPreview";
import { useAutomationVariables } from "../../shared/useAutomationVariables";
import expressionStyles from "./ActionStepEditor/components/ActionParameter.module.scss";
import styles from "./StepSettingsHeader.module.scss";
import { TriggerFields } from "../TriggerFields";

interface Props {
  step: AwaitStep;
  parameters: Automation["parameters"];
  expressions: Automation["expressions"];
  capabilities: ExpressionBuilderModalProps["capabilities"];
  onChange: (step: AutomationStep) => void;
  onDelete: () => void;
  onExpressionChange: (
    update: (
      expressions: Automation["expressions"],
    ) => Automation["expressions"],
  ) => void;
}

const defaultTimeout: ExpressionArg = {
  type: "literal",
  value: 1,
  data_type: "number",
};

export function AwaitStepEditor({
  step,
  parameters,
  expressions,
  capabilities,
  onChange,
  onDelete,
  onExpressionChange,
}: Props) {
  const variables = useAutomationVariables(parameters);
  const [isTimeoutEditorOpen, setIsTimeoutEditorOpen] = useState(false);
  const hasTimeout = step.timeout != null;

  function updateTrigger(trigger: AwaitStep["trigger"]) {
    onChange({ ...step, trigger });
  }

  function updateTimeout(timeout: ExpressionArg | null) {
    onChange({ ...step, timeout });
  }

  const timeoutPreview = hasTimeout
    ? getExpressionPreview(step.timeout, expressions, capabilities)
    : "Без ограничения времени";

  return (
    <>
      <header className={styles.header}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <Typography type="small" className={styles.eyebrow}>
              НАСТРОЙКИ ОЖИДАНИЯ
            </Typography>
            <Typography type="title-2">Ожидание события</Typography>
          </div>

          <Button type="button" onClick={onDelete}>
            Удалить
          </Button>
        </div>
      </header>

      <div style={{ display: "grid", gap: 16, padding: "12px 0" }}>
        <section
          aria-label="Событие"
          style={{ display: "grid", gap: 10 }}
        >
          <Typography type="body">Событие</Typography>
          <TriggerFields
            trigger={step.trigger}
            onChange={updateTrigger}
            expressions={expressions}
            onExpressionsChange={onExpressionChange}
            variables={variables}
            capabilities={capabilities}
            showTypeSelect
          />
        </section>

        <section
          aria-label="Тайм-аут"
          style={{ display: "grid", gap: 10 }}
        >
          <Typography type="body">Тайм-аут</Typography>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={hasTimeout}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  updateTimeout(defaultTimeout);
                } else {
                  updateTimeout(null);
                  setIsTimeoutEditorOpen(false);
                }
              }}
            />
            Ограничить время ожидания
          </label>

          {hasTimeout && (
            <button
              type="button"
              className={`${expressionStyles.expressionButton} ${expressionStyles.hasValue}`}
              onClick={() => setIsTimeoutEditorOpen(true)}
            >
              <span className={expressionStyles.expressionContent}>
                <span className={expressionStyles.expressionLabel}>
                  ВРЕМЯ ОЖИДАНИЯ · NUMBER
                </span>
                <span className={expressionStyles.expressionPreview}>
                  {timeoutPreview}
                </span>
              </span>
              <span className={expressionStyles.editIcon} aria-hidden="true">
                ✎
              </span>
            </button>
          )}
        </section>
      </div>

      {isTimeoutEditorOpen && hasTimeout && (
        <ExpressionBuilderModal
          type="number"
          value={step.timeout ?? defaultTimeout}
          expressions={expressions}
          capabilities={capabilities}
          variables={variables}
          onChange={updateTimeout}
          onExpressionsChange={onExpressionChange}
          onClose={() => setIsTimeoutEditorOpen(false)}
        />
      )}
    </>
  );
}
