import type {
  Automation,
  AutomationStep,
  ConditionStep,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { useState } from "react";

import {
  Button,
  Typography,
} from "alex-evo-sh-ui-kit";

import styles from "./StepSettingsHeader.module.scss";
import styles2 from "./ActionStepEditor/components/ActionParameter.module.scss";
import { useActionCommands } from "./ActionStepEditor/hooks/useActionCommands";
import { useAutomationVariables } from "../../shared/useAutomationVariables";
import { ExpressionBuilderModal } from "../../expressionBuilder/StartBlock";
import { getExpressionPreview } from "../../shared/expressionPreview";

interface Props {
  step: ConditionStep;
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

export function ConditionStepEditor({
  step,
  parameters,
  expressions,
  onChange,
  onDelete,
  onExpressionChange,
}: Props) {
  const { capabilities } = useActionCommands();

  const variables = useAutomationVariables(parameters);

  const [isExpressionOpen, setIsExpressionOpen] = useState(false);

  const conditionStep = step as ConditionStep;

  function updateCondition(value: ExpressionArg) {
    onChange({
      ...conditionStep,
      condition: value,
    });
  }

  const hasCondition = Boolean(conditionStep.condition);

  const preview = hasCondition
    ? getExpressionPreview(step.condition, expressions, capabilities)
    : "Значение не задано";

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
              НАСТРОЙКИ УСЛОВИЯ
            </Typography>

            <Typography type="title-2">
              Условие
            </Typography>
          </div>

          <Button type="button" onClick={onDelete}>
            Удалить
          </Button>
        </div>
      </header>

      <div style={{ padding: "12px 0" }}>
        <button
          type="button"
          className={`${styles2.expressionButton} ${
            hasCondition ? styles2.hasValue : styles2.empty
          }`}
          onClick={()=>setIsExpressionOpen(true)}
        >
          <span className={styles2.expressionContent}>
            <span className={styles2.expressionLabel}>
              {hasCondition ? "ВЫРАЖЕНИЕ" : "НАСТРОЙКА ЗНАЧЕНИЯ"}
            </span>

            <span className={styles2.expressionPreview}>
              {preview}
            </span>
          </span>

          <span className={styles2.editIcon} aria-hidden="true">
            ✎
          </span>
        </button>
      </div>

      {isExpressionOpen && (
        <ExpressionBuilderModal
          type="boolean"
          value={conditionStep.condition}
          expressions={expressions}
          capabilities={capabilities}
          variables={variables}
          onChange={updateCondition}
          onExpressionsChange={onExpressionChange}
          onClose={() => setIsExpressionOpen(false)}
        />
      )}
    </>
  );
}