import type { ExpressionArg } from "@src/entites/automation_v4";

export type ValueMode = "literal" | "path" | "ref";

export function getValueMode(
  value?: ExpressionArg,
): ValueMode {
  if (!value) return "literal";

  switch (value.type) {
    case "path":
      return "path";

    case "ref":
      return "ref";

    case "literal":
    default:
      return "literal";
  }
}