import { useState } from "react";

import type {
  Automation,
  AutomationStep,
} from "@src/entites/automation_v4";

import "./AutomationEditor.scss";

import type {
  EditorSelection,
  StepEditorKind,
} from "./model/editorTypes";

import { AutomationFlow } from "./flow/AutomationFlow";
import { AutomationSettingsPanel } from "./settings/AutomationSettingsPanel";
import { Button, Panel, TextField, Typography } from "alex-evo-sh-ui-kit";
import { Sidebar } from "@src/shared/ui/SideBar";

interface AutomationEditorProps {
  automation: Automation;
  onChange: (automation: Automation) => void;
  onSave?: () => void;
  saving?: boolean;

  /**
   * Создаёт новый шаг с обязательными полями,
   * соответствующими backend-схеме.
   */
  createStep: (
    kind: StepEditorKind,
    id: string,
  ) => AutomationStep;
}

function createId(): string {
  return crypto.randomUUID();
}

export function AutomationEditor({
  automation,
  onChange,
  onSave,
  saving = false,
  createStep,
}: AutomationEditorProps) {
  const [selection, setSelection] = useState<EditorSelection | null>(null);

  function updateAutomation(patch: Partial<Automation>) {
    console.log("patch", patch)
    onChange({
      ...automation,
      ...patch,
    });
  }

  function addStep(kind: StepEditorKind) {
    const id = createId();
    const step = createStep(kind, id);

    updateAutomation({
      steps: {
        ...automation.steps,
        [id]: step,
      },

      // Если это первый шаг, он становится точкой входа.
      entry: automation.entry || id,
    });

    setSelection({
      type: "step",
      id,
    });
  }

  function updateStep(id: string, step: AutomationStep) {
    updateAutomation({
      steps: {
        ...automation.steps,
        [id]: step,
      },
    });
  }

  function deleteStep(id: string) {
    const remainingSteps = { ...automation.steps };

    delete remainingSteps[id];

    /*
     * Удаляем ссылки на шаг, чтобы не оставлять заведомо
     * несуществующие next/on_true/on_false/on_timeout.
     */
    const cleanedSteps: Automation["steps"] = {};

    for (const [stepId, step] of Object.entries(remainingSteps)) {
      const updated = { ...step } as Record<string, unknown>;

      for (const field of [
        "next",
        "on_true",
        "on_false",
        "on_timeout",
      ]) {
        if (updated[field] === id) {
          updated[field] = undefined;
        }
      }

      cleanedSteps[stepId] = updated as any as AutomationStep;
    }

    const nextEntry =
      automation.entry === id
        ? Object.keys(cleanedSteps)[0] ?? ""
        : automation.entry;

    updateAutomation({
      steps: cleanedSteps,
      entry: nextEntry,
    });

    setSelection({ type: "start" });
  }

  return (
    <div className="automation-editor">
      <Panel className="automation-editor__header">
        <div className="automation-editor__heading">
          <Typography type="title-2">РЕДАКТОР АВТОМАТИЗАЦИИ</Typography>

          <TextField
            border
            value={automation.name}
            placeholder="Название сценария"
            onChange={(event) =>
              updateAutomation({ name: event.target.value })
            }
            aria-label="Название сценария"
          />
        </div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Typography type="small">
            Вертикальный конструктор сценариев
          </Typography>

          <Button
            type="button"
            className="automation-button automation-button--primary"
            onClick={onSave}
            disabled={!onSave || saving}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
        
      </Panel>
        
      <div className="automation-editor__body">
        <AutomationFlow
          automation={automation}
          selection={selection}
          onSelect={setSelection}
          onAddStep={addStep}
        />

        <Sidebar isOpen={selection!==null} onClose={()=>setSelection(null)}>
          <AutomationSettingsPanel
            automation={automation}
            selection={selection}
            onChange={updateAutomation}
            onStepChange={updateStep}
            onStepDelete={deleteStep}
          />
        </Sidebar>
      </div>
    </div>
  );
}