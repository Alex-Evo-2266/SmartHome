import type {
  Automation,
  ExpressionArgWithNull,
  ExpressionCapabilitiesResponse,
} from "@src/entites/automation_v4";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatLiteralValue(value: unknown): string {
  if (value === null || value === undefined) return "Не задано";
  if (typeof value === "boolean") return value ? "Да" : "Нет";
  if (typeof value === "string") return value || "Пустая строка";
  if (typeof value === "number") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getOperatorLabel(
  capabilities: ExpressionCapabilitiesResponse | null,
  type: "binary" | "unary" | "group",
  op: unknown,
): string {
  if (typeof op !== "string") return "Операция";

  const operators = capabilities?.operators[type];
  const operator = operators?.find((item) => item.id === op);

  return operator?.symbol ?? operator?.name ?? op;
}

function getFunctionLabel(
  capabilities: ExpressionCapabilitiesResponse | null,
  fn: unknown,
): string {
  if (typeof fn !== "string") return "Функция";

  const func = capabilities?.functions.find((item) => item.id === fn);

  return func?.name ?? fn;
}

export function getExpressionPreview(
  value: ExpressionArgWithNull | unknown,
  expressions: Automation["expressions"],
  capabilities: ExpressionCapabilitiesResponse | null,
  depth = 0,
): string {
  if (!value) return "Не задано";

  if (!isRecord(value) || depth > 5) {
    return "Выражение";
  }

  const nested = (item: unknown) =>
    getExpressionPreview(item, expressions, capabilities, depth + 1);

  switch (value.type) {
    case "literal":
      return formatLiteralValue(value.value);

    case "path":
      return typeof value.path === "string"
        ? value.path
        : "Путь не выбран";

    case "ref": {
      if (typeof value.ref !== "string") {
        return "Выражение не найдено";
      }

      const expression: unknown = expressions[value.ref];

      if (!isRecord(expression)) {
        return "Выражение не найдено";
      }

      switch (expression.type) {
        case "binary": {
          const left = nested(expression.left);
          const right = nested(expression.right);
          const operator = getOperatorLabel(
            capabilities,
            "binary",
            expression.op,
          );

          return `${left} ${operator} ${right}`;
        }

        case "unary": {
          const operator = getOperatorLabel(
            capabilities,
            "unary",
            expression.op,
          );

          const argument = nested(expression.arg);

          return `${operator}${operator.length > 1 ? " " : ""}${argument}`;
        }

        case "group": {
          const items = Array.isArray(expression.items)
            ? expression.items
            : [];

          const operator = getOperatorLabel(
            capabilities,
            "group",
            expression.op,
          );

          return items.length
            ? items.map(nested).join(` ${operator} `)
            : "Пустая группа";
        }

        case "call": {
          const fn = getFunctionLabel(capabilities, expression.fn);
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

export function getConditionLabel(value: ExpressionArgWithNull): {
  type: string;
  title: string;
  description: string;
} {
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
        description: value.ref
          ? `ID: ${value.ref}`
          : "Необходимо выбрать выражение",
      };

    default:
      return {
        type: "Выражение",
        title: "Неизвестное значение",
        description: "Нажмите, чтобы настроить условие",
      };
  }
}