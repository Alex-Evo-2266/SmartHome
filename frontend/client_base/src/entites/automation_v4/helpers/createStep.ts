
import type {
  AutomationStep,
  AutomationTrigger,
  ExpressionArg,
} from "@src/entites/automation_v4";
import { StepEditorKind } from "./editorTypes";


const createLiteral = (
  value: boolean | number,
  data_type: "boolean" | "number",
): ExpressionArg => ({
  type: "literal",
  value,
  data_type,
});

export function createStep(
  kind: StepEditorKind,
  _id?: string,
): AutomationStep {
  switch (kind) {
    case "action":
      return {
        type: "action",
        command: "",
        params: {},
        label: "Новое действие",
        next: null,
      };

    case "delay":
      return {
        type: "delay",
        duration: createLiteral(1, "number"),
        label: "Задержка",
        next: null,
      };

    case "condition":
      return {
        type: "condition",
        condition: createLiteral(false, "boolean"),
        label: "Условие",
        on_true: null,
        on_false: null,
        next: null,
      };

    case "await": {
      const trigger: AutomationTrigger = {
        type: "device",
        device: "",
        field: "",
        condition: null,
      };

      return {
        type: "await",
        trigger,
        timeout: null,
        on_timeout: null,
        label: "Ожидание события",
        next: null,
      };
    }

    case "script":
      return {
        type: "script",
        script: "",
        params: {},
        label: "Вызов сценария",
        next: null,
      };

    default: {
      const exhaustiveCheck: never = kind;
      throw new Error(`Неизвестный тип шага: ${exhaustiveCheck}`);
    }
  }
}
