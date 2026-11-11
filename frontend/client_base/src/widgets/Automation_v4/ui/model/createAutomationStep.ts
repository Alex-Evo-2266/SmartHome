import type {
  AutomationStep,
} from "@src/entites/automation_v4";

import type { StepEditorKind } from "../../../../entites/automation_v4/helpers/editorTypes";

export function createAutomationStep(
  kind: StepEditorKind,
  _id: string,
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
        duration: {
          type: "literal",
          value: 1,
          data_type: "number",
        },
        label: "Задержка",
        next: null,
      };

    case "condition":
      return {
        type: "condition",
        condition: {
          type: "literal",
          value: false,
          data_type: "boolean",
        },
        label: "Условие",
        on_true: null,
        on_false: null,
        next: null,
      };

    case "await":
      return {
        type: "await",
        trigger: {
          type: "device",
          device: "",
          field: "",
          condition: null,
        },
        label: "Ожидание события",
        timeout: null,
        on_timeout: null,
        next: null,
      };

    case "script":
      return {
        type: "script",
        script: "",
        params: {},
        label: "Вызов сценария",
        next: null,
      };
  }
}