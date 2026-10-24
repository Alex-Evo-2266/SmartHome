import type { AutomationStep } from "@src/entites/automation_v4";
import { StepJsonEditor } from "./StepJsonEditor";

interface Props {
  step: AutomationStep;
  onChange: (step: AutomationStep) => void;
  onDelete: () => void;
}

export function DelayStepEditor(props: Props) {
  return <StepJsonEditor {...props} title="Задержка" />;
}