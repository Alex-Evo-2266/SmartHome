import { useCallback, useState, type ChangeEvent } from "react";

import type {
  Automation,
  AutomationStep,
} from "@src/entites/automation_v4";

import "./AutomationEditor.scss";

import type {
  EditorSelection,
  StepEditorKind,
} from "../../../entites/automation_v4/helpers/editorTypes";

import { AutomationFlow } from "./flow/AutomationFlow";
import { AutomationSettingsPanel } from "./settings/AutomationSettingsPanel";
import { Button, Panel, TextField, Typography } from "alex-evo-sh-ui-kit";
import { Sidebar } from "@src/shared/ui/SideBar";
import { createStep } from "@src/entites/automation_v4/helpers/createStep";

interface AutomationEditorProps {
  automation: Automation;
  onChange: React.Dispatch<React.SetStateAction<Automation | null>>;
  onSave?: () => void;
  saving?: boolean;
}

function createId(): string {
  return crypto.randomUUID();
}

export function AutomationEditor({
  automation,
  onChange,
  onSave,
  saving = false,
}: AutomationEditorProps) {
  const [selection, setSelection] = useState<EditorSelection | null>(null);

  const updateAutomation = useCallback((patch: Partial<Automation>) => {
    onChange((prev) => {
      if (!prev) return prev;

      return {
          ...prev,
          ...patch,
      };
  });
  },[onChange])

  const updateExpressions = useCallback(
    (
      update: (expressions: Automation["expressions"]) => Automation["expressions"],
    ) => {
      onChange((previous) =>
        previous
          ? {
              ...previous,
              expressions: update(previous.expressions),
            }
          : previous,
      );
    },
    [onChange],
  );

  function addStep(kind: StepEditorKind, afterStepId: string | null) {
    const id = createId();
    const newStep = createStep(kind, id);

    onChange((previous) => {
      if (!previous) return previous;

      const steps = { ...previous.steps };

      if (afterStepId === null) {
        // Вставка сразу после стартового узла.
        const updatedNewStep = {
          ...newStep,
          next: previous.entry || null,
        } as AutomationStep;

        steps[id] = updatedNewStep;

        return {
          ...previous,
          steps,
          entry: id,
        };
      }

      const previousStep = steps[afterStepId];

      if (!previousStep) return previous;

      const previousNext =
        previousStep.next ?? null;

      // Новый шаг продолжает прежнюю последовательность.
      const updatedNewStep = {
        ...newStep,
        next: previousNext,
      } as AutomationStep;

      // Предыдущий шаг теперь ведёт на новый.
      steps[afterStepId] = {
        ...previousStep,
        next: id,
      } as AutomationStep;

      steps[id] = updatedNewStep;

      return {
        ...previous,
        steps,
      };
    });

    setSelection({
      type: "step",
      id,
    });
  }

  const updateStep = useCallback((id: string, step: AutomationStep) => {
    updateAutomation({
      steps: {
        ...automation.steps,
        [id]: step,
      },
    });
  },[automation])

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
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
            onExpressionsChange={updateExpressions}
            onStepChange={updateStep}
            onStepDelete={deleteStep}
          />
        </Sidebar>
      </div>
    </div>
  );
}