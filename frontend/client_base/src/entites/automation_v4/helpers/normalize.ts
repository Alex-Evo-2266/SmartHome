import { Automation, LiteralArg } from "../models/automation";


/**
 * Приводит значение LiteralArg к типу data_type.
 */
function normalizeLiteral(arg: LiteralArg): LiteralArg {
  const { value, data_type } = arg;

  if (value === null || value === undefined || !data_type) {
    return arg;
  }

  switch (data_type) {
    case "boolean": {
      if (typeof value === "boolean") return arg;

      if (value === 1 || value === "1" || value === "true") {
        return { ...arg, value: true };
      }

      if (value === 0 || value === "0" || value === "false") {
        return { ...arg, value: false };
      }

      return arg;
    }

    case "number": {
      if (typeof value === "number") return arg;

      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);

        if (Number.isFinite(parsed)) {
          return { ...arg, value: parsed };
        }
      }

      return arg;
    }

    case "string": {
      if (typeof value === "string") return arg;

      return { ...arg, value: String(value) };
    }

    default:
      return arg;
  }
}

/**
 * Рекурсивно нормализует все LiteralArg внутри объекта.
 */
function normalizeDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => normalizeDeep(item)) as T;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  const object = value as Record<string, unknown>;

  if (object.type === "literal") {
    return normalizeLiteral(object as unknown as LiteralArg) as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(object)) {
    result[key] = normalizeDeep(item);
  }

  return result as T;
}

/**
 * Нормализует все LiteralArg в сценарии.
 * Исходный объект не изменяется.
 */
export function normalizeAutomation(
  automation: Automation,
): Automation {
  return normalizeDeep(automation);
}
