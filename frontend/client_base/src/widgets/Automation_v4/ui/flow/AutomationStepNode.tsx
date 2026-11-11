import type { AutomationStep } from "@src/entites/automation_v4";
import {
  getStepEditorKind,
  getStepTitle,
  STEP_ICONS,
} from "../../../../entites/automation_v4/helpers/editorTypes";
import { ListItem } from "alex-evo-sh-ui-kit";

interface AutomationStepNodeProps {
  id: string;
  step: AutomationStep;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function AutomationStepNode({
  id,
  step,
  index,
  selected,
  onSelect,
}: AutomationStepNodeProps) {
  const kind = getStepEditorKind(step);

  return (
        <ListItem
            active={selected}
            className="automation-editor_step"
            header={step.label ?? "шаг"}
            icon={STEP_ICONS[kind]}
            text={`${index + 1}. ${getStepTitle(step)}  ${kind}`}
            onClick={()=>onSelect(id)}
        />
  );
}