import type {
  Automation,
  ExpressionArgWithNull,
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

export function getExpressionPreview(
  value: ExpressionArgWithNull | unknown,
  expressions: Automation["expressions"],
  depth = 0,
): string {
  if (!value) return "Не задано";

  if (!isRecord(value) || depth > 5) {
    return "Выражение";
  }

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

      const expression = expressions[value.ref] as unknown;

      if (!isRecord(expression)) {
        return "Выражение не найдено";
      }

      const nested = (item: unknown) => getExpressionPreview(item, expressions, depth + 1);

      switch (expression.type) {
        case "binary": {
          const left = nested(expression.left);
          const right = nested(expression.right);
          return `${left} ${String(expression.op ?? "")} ${right}`;
        }

        case "unary":
          return `${String(expression.op ?? "")} ${nested(expression.arg)}`;

        case "group": {
          const items = Array.isArray(expression.items) ? expression.items : [];
          const separator = ` ${String(expression.op ?? "")} `;
          return items.length ? items.map(nested).join(separator) : "Пустая группа";
        }

        case "call": {
          const fn = String(expression.fn ?? "Функция");
          const args = Array.isArray(expression.args) ? expression.args : [];
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
        description: value.ref ? `ID: ${value.ref}` : "Необходимо выбрать выражение",
      };

    default:
      return {
        type: "Выражение",
        title: "Неизвестное значение",
        description: "Нажмите, чтобы настроить условие",
      };
  }
}
