import type {
  Automation,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { Button } from "alex-evo-sh-ui-kit";

interface Props {
  value?: ExpressionArg;
  expressions: Automation["expressions"];
  onOpen: () => void;
}

export function RefParameterField({
  value,
  expressions,
  onOpen,
}: Props) {
  const ref =
    value?.type === "ref"
      ? value.ref
      : null;

  const exists = ref
    ? Boolean(expressions[ref])
    : false;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        {exists
          ? `Связь: ${ref}`
          : "Выражение не создано"}
      </div>

      <Button
        type="button"
        onClick={onOpen}
      >
        {exists
          ? "Редактировать выражение"
          : "Создать выражение"}
      </Button>
    </div>
  );
}