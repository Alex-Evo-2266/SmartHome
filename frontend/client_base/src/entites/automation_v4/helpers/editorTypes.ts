import type { AutomationStep } from "@src/entites/automation_v4";

export type EditorSelection =
  | { type: "start" }
  | { type: "step"; id: string };

export type StepEditorKind =
  | "action"
  | "delay"
  | "condition"
  | "await"
  | "script";

export const STEP_TITLES: Record<StepEditorKind, string> = {
  action: "Действие устройства",
  delay: "Задержка",
  condition: "Условие",
  await: "Ожидание события",
  script: "Вызов сценария",
};

export const STEP_ICONS: Record<StepEditorKind, string> = {
  action: "⚡",
  delay: "◷",
  condition: "⑂",
  await: "◉",
  script: "ƒ",
};

export function getStepEditorKind(
  step: AutomationStep,
): StepEditorKind {
  switch (step.type) {
    case "action":
      return "action";
    case "delay":
      return "delay";
    case "condition":
      return "condition";
    case "await":
      return "await";
    case "script":
      return "script";
  }
}

export function getStepTitle(step: AutomationStep): string {
  return step.label || STEP_TITLES[getStepEditorKind(step)];
}


export type TriggerKind = "device" | "room" | "time";