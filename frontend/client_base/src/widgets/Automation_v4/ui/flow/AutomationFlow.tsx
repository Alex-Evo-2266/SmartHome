import { useState } from "react";
import type {
  Automation,
  AutomationStep,
} from "@src/entites/automation_v4";
import type {
  EditorSelection,
  EntryMode,
  StepEditorKind,
} from "../model/editorTypes";
import { STEP_TITLES } from "../model/editorTypes";
import { AutomationStartNode } from "./AutomationStartNode";
import { AutomationStepNode } from "./AutomationStepNode";
import { Panel } from "alex-evo-sh-ui-kit";

interface AutomationFlowProps {
  automation: Automation;
  entryMode: EntryMode;
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection) => void;
  onAddStep: (kind: StepEditorKind) => void;
}

export function AutomationFlow({
  automation,
  entryMode,
  selection,
  onSelect,
  onAddStep,
}: AutomationFlowProps) {
  const [kindToAdd, setKindToAdd] =
    useState<StepEditorKind>("action");

  const steps = Object.entries(automation.steps) as [
    string,
    AutomationStep,
  ][];

  return (
    <main className="automation-editor__canvas">
      <Panel className="automation-editor__canvas-heading">
        <div>
          <h2>Последовательность</h2>
          <p>Выберите ячейку, чтобы открыть её настройки</p>
        </div>

        <span className="automation-editor__step-count">
          {steps.length} шагов
        </span>
      </Panel>

      <div className="automation-flow">
        <AutomationStartNode
          mode={entryMode}
          selected={selection !== null && selection.type === "start"}
          onSelect={() => onSelect({ type: "start" })}
        />

        {steps.map(([id, step], index) => (
          <div className="automation-flow__item" key={id}>
            <div className="automation-flow__connector" />

            <AutomationStepNode
              id={id}
              step={step}
              index={index}
              selected={
                selection !== null &&  selection.type === "step" && selection.id === id
              }
              onSelect={(stepId) =>
                onSelect({ type: "step", id: stepId })
              }
            />
          </div>
        ))}

        <div className="automation-add-step">
          <select
            value={kindToAdd}
            onChange={(event) =>
              setKindToAdd(event.target.value as StepEditorKind)
            }
            aria-label="Тип нового шага"
          >
            {Object.entries(STEP_TITLES).map(([kind, title]) => (
              <option key={kind} value={kind}>
                {title}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="automation-button automation-button--outline"
            onClick={() => onAddStep(kindToAdd)}
          >
            + Добавить шаг
          </button>
        </div>
      </div>
    </main>
  );
}