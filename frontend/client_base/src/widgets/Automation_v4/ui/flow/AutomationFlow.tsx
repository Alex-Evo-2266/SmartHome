
import { useMemo, useState } from "react";

import type {
  Automation,
  AutomationStep,
} from "@src/entites/automation_v4";

import type {
  EditorSelection,
  StepEditorKind,
} from "../../../../entites/automation_v4/helpers/editorTypes";

import { STEP_TITLES } from "../../../../entites/automation_v4/helpers/editorTypes";
import { AutomationStartNode } from "./AutomationStartNode";
import { AutomationStepNode } from "./AutomationStepNode";
import { Panel } from "alex-evo-sh-ui-kit";

import "./styleFlow.scss";

interface AutomationFlowProps {
  automation: Automation;
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection) => void;
  onAddStep: (kind: StepEditorKind, target: string | null) => void;
}

export function AutomationFlow({
  automation,
  selection,
  onSelect,
  onAddStep,
}: AutomationFlowProps) {
  const [addTarget, setAddTarget] = useState<
    string | null | undefined
  >(undefined);

  const steps = useMemo(() => {
    const result: [string, AutomationStep][] = [];
    const visited = new Set<string>();

    let currentId: string | null | undefined = automation.entry;

    // Строим последовательность по next.
    while (currentId && !visited.has(currentId)) {
      const step: AutomationStep = automation.steps[currentId];

      if (!step) break;

      visited.add(currentId);
      result.push([currentId, step]);

      const next: string | null | undefined = step.next;

      currentId = next;
    }

    // Добавляем неподключённые шаги отдельно,
    // чтобы их можно было увидеть и отредактировать.
    for (const [id, step] of Object.entries(automation.steps)) {
      if (!visited.has(id)) {
        result.push([id, step]);
      }
    }

    return result;
  }, [automation.entry, automation.steps]);

  const handleAddStep = (
    kind: StepEditorKind,
    target: string | null,
  ) => {
    onAddStep(kind, target);
    setAddTarget(undefined);
  };

  return (
    <main className="automation-editor__canvas">
      <Panel className="automation-editor__canvas-heading">
        <div>
          <h2>Последовательность</h2>
          <p>Выберите шаг, чтобы открыть его настройки</p>
        </div>

        <span className="automation-editor__step-count">
          {steps.length} шагов
        </span>
      </Panel>

      <div className="automation-flow">
        <div className="automation-flow__branches">
          <span className="automation-flow__branch active">
            Основная
          </span>
        </div>

        <div className="automation-flow__list">
          <AutomationStartNode
            automation={automation}
            selected={selection?.type === "start"}
            onSelect={() => onSelect({ type: "start" })}
          />

          <button
            type="button"
            className="automation-flow__insert"
            aria-label="Добавить первый шаг"
            onClick={() => setAddTarget(null)}
          >
            <span>+</span>
          </button>

          {steps.map(([id, step], index) => (
            <div className="automation-flow__item" key={id}>
              <AutomationStepNode
                id={id}
                step={step}
                index={index}
                selected={
                  selection?.type === "step" &&
                  selection.id === id
                }
                onSelect={(stepId) =>
                  onSelect({ type: "step", id: stepId })
                }
              />

              <button
                type="button"
                className="automation-flow__insert"
                aria-label={`Добавить шаг после шага ${index + 1}`}
                onClick={() => setAddTarget(id)}
              >
                <span>+</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {addTarget !== undefined && (
        <div
          className="automation-flow__modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAddTarget(undefined);
            }
          }}
        >
          <div
            className="automation-flow__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="automation-flow-modal-title"
          >
            <div className="automation-flow__modal-header">
              <h3 id="automation-flow-modal-title">
                Добавить шаг
              </h3>

              <button
                type="button"
                className="automation-flow__modal-close"
                onClick={() => setAddTarget(undefined)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            <div className="automation-flow__modal-options">
              {Object.entries(STEP_TITLES).map(([kind, title]) => (
                <button
                  key={kind}
                  type="button"
                  className="automation-flow__modal-option"
                  onClick={() =>
                    handleAddStep(kind as StepEditorKind, addTarget)
                  }
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
