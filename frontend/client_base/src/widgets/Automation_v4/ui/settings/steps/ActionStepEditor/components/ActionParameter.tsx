
import type {
  Automation,
  DeviceCommandParameter,
  ExpressionArg,
} from "@src/entites/automation_v4";

import styles from "./ActionParameter.module.scss";
import { getExpressionPreview } from "../../../../shared/expressionPreview";

interface Props {
  parameter: DeviceCommandParameter;
  value?: ExpressionArg;
  expressions: Automation["expressions"];
  onOpenExpression: () => void;
}

function getValueTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    number: "Число",
    string: "Строка",
    boolean: "Логическое",
    any: "Любой тип",
    path: "Путь",
    for_path: "Для пути",
    enum: "Перечисление",
  };

  return labels[type] ?? type;
}

export function ActionParameter({
  parameter,
  value,
  expressions,
  onOpenExpression,
}: Props) {
  const hasValue = value !== undefined && value !== null;
  const preview = hasValue
    ? getExpressionPreview(value, expressions)
    : "Значение не задано";

  return (
    <section className={styles.parameter}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.title}>
            {parameter.title || parameter.name}
          </span>

          <span className={styles.type}>
            {getValueTypeLabel(parameter.data_type)}
          </span>
        </div>
      </div>

      {parameter.description && (
        <p className={styles.description}>
          {parameter.description}
        </p>
      )}

      <button
        type="button"
        className={`${styles.expressionButton} ${
          hasValue ? styles.hasValue : styles.empty
        }`}
        onClick={onOpenExpression}
      >
        <span className={styles.expressionContent}>
          <span className={styles.expressionLabel}>
            {hasValue ? "ВЫРАЖЕНИЕ" : "НАСТРОЙКА ЗНАЧЕНИЯ"}
          </span>

          <span className={styles.expressionPreview}>
            {preview}
          </span>
        </span>

        <span className={styles.editIcon} aria-hidden="true">
          ✎
        </span>
      </button>
    </section>
  );
}
