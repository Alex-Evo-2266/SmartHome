import type { AutomationStep } from "@src/entites/automation_v4";
import {
  getStepEditorKind,
  getStepTitle,
  STEP_ICONS,
} from "../model/editorTypes";

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
    <button
      type="button"
      className={[
        "automation-node",
        selected ? "automation-node--selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(id)}
    >
      <span className="automation-node__icon" aria-hidden="true">
        {STEP_ICONS[kind]}
      </span>

      <span className="automation-node__content">
        <strong>
          {index + 1}. {getStepTitle(step)}
        </strong>
        <span>{kind}</span>
      </span>

      <span className="automation-node__chevron" aria-hidden="true">
        ›
      </span>
    </button>
  );
}