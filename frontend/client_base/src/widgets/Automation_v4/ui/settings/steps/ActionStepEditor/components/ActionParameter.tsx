
import type {
  Automation,
  DeviceCommandParameter,
  ExpressionArg,
} from "@src/entites/automation_v4";

import type { ObjectNode } from "@src/shared/lib/object-map/types";

import { PathParameterField } from "./PathParameterField";

import styles from "./ActionParameter.module.scss";

interface Props {
  parameter: DeviceCommandParameter;
  value?: ExpressionArg;
  expressions: Automation["expressions"];
  variables: Record<string, ObjectNode>;

  onChange: (value: ExpressionArg) => void;
  onOpenExpression: () => void;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function formatLiteral(value: unknown): string {
  if (value === null || value === undefined) return "Не задано";
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  if (typeof value === "string") return value || 'Пустая строка';
  if (typeof value === "number") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getExpressionPreview(
  arg: unknown,
  expressions: Automation["expressions"],
  depth = 0,
): string {
  if (!isRecord(arg) || depth > 5) {
    return "Выражение";
  }

  switch (arg.type) {
    case "literal":
      return formatLiteral(arg.value);

    case "path":
      return typeof arg.path === "string"
        ? arg.path
        : "Путь не выбран";

    case "ref": {
      if (typeof arg.ref !== "string") {
        return "Выражение не найдено";
      }

      const expression = expressions[arg.ref] as unknown;

      if (!isRecord(expression)) {
        return "Выражение не найдено";
      }

      const nested = (value: unknown) =>
        getExpressionPreview(value, expressions, depth + 1);

      switch (expression.type) {
        case "binary":
          return `${nested(expression.left)} ${String(expression.op ?? "")} ${nested(expression.right)}`;

        case "unary":
          return `${String(expression.op ?? "")} ${nested(expression.arg)}`;

        case "group": {
          const items = Array.isArray(expression.items)
            ? expression.items
            : [];

          const separator = ` ${String(expression.op ?? "")} `;

          return items.length
            ? items.map(nested).join(separator)
            : "Пустая группа";
        }

        case "call": {
          const fn = String(expression.fn ?? "Функция");

          const args = Array.isArray(expression.args)
            ? expression.args
            : [];

          return `${fn}(${args.map(nested).join(", ")})`;
        }

        default:
          return "Выражение";
      }
    }

    default:
      return "Выражение";
  }
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
  variables,
  onChange,
  onOpenExpression,
}: Props) {
  const isPathParameter =
    parameter.data_type === "path" ||
    parameter.name === "path";

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

      {/* {isPathParameter ? (
        <div className={styles.pathEditor}>
          <button onClick={onOpenExpression}>test</button>
          <PathParameterField
            value={value}
            variables={variables}
            onChange={onChange}
          />
        </div>
      ) : (
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
      )} */}
    </section>
  );
}
