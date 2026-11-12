import type { Automation, AutomationStep } from "@src/entites/automation_v4";
import { createStep } from "@src/entites/automation_v4/helpers/createStep";
import { DialogPortal } from "@src/shared";
import { Sidebar } from "@src/shared/ui/SideBar";
import { BaseActionCard, BasicTemplateDialog, Button, Panel, TextField, Typography } from "alex-evo-sh-ui-kit";
import { useCallback, useState, type ChangeEvent } from "react";

import { AutomationFlow } from "./flow/AutomationFlow";
import { AutomationSettingsPanel } from "./settings/AutomationSettingsPanel";
import type {
  EditorSelection,
  StepEditorKind,
} from "../../../entites/automation_v4/helpers/editorTypes";
import "./AutomationEditor.scss";

interface AutomationEditorProps {
  automation: Automation;
  onChange: React.Dispatch<React.SetStateAction<Automation | null>>;
  onSave?: () => void;
  onCreateNew?: () => void;
  mode?: "create" | "edit";
  dirty?: boolean;
  saving?: boolean;
  creating?: boolean;
}

function createId(): string {
  return crypto.randomUUID();
}

export function AutomationEditor({
  automation,
  onChange,
  onSave,
  onCreateNew,
  mode = "edit",
  dirty = false,
  saving = false,
  creating = false,
}: AutomationEditorProps) {
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const updateAutomation = useCallback((patch: Partial<Automation>) => {
    console.log("p9", patch)
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
  }, [automation, updateAutomation]);

  function deleteStep(id: string) {
    const remainingSteps = { ...automation.steps };

    delete remainingSteps[id];

    /*
     * Удаляем ссылки на шаг, чтобы не оставлять заведомо
     * несуществующие next/on_true/on_false/on_timeout.
     */
    const cleanedSteps: Automation["steps"] = {};

    for (const [stepId, step] of Object.entries(remainingSteps)) {
      const updated: AutomationStep = { ...step };
      if (updated.next === id) updated.next = undefined;
      if ("on_true" in updated && updated.on_true === id) updated.on_true = undefined;
      if ("on_false" in updated && updated.on_false === id) updated.on_false = undefined;
      if ("on_timeout" in updated && updated.on_timeout === id) updated.on_timeout = undefined;

      cleanedSteps[stepId] = updated;
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
          <Typography type="title-2">
            {mode === "create" ? "НОВЫЙ СЦЕНАРИЙ" : "РЕДАКТОР АВТОМАТИЗАЦИИ"}
          </Typography>

          <TextField
            border
            value={automation.name}
            placeholder="Название сценария"
            onChange={(name) =>
              updateAutomation({ name })
            }
            aria-label="Название сценария"
          />
        </div>
        <div style={{display: "flex", justifyContent: "space-between", gap: "8px"}}>
          {onCreateNew && (
            <Button
              type="button"
              onClick={() => dirty ? setConfirmDiscard(true) : onCreateNew()}
              disabled={saving || creating}
            >
              {mode === "create" ? "Начать заново" : "Создать сценарий"}
            </Button>
          )}
          <Button
            type="button"
            className="automation-button automation-button--primary"
            onClick={onSave}
            disabled={!onSave || saving || creating}
          >
            {creating
              ? "Создание…"
              : saving
                ? "Сохранение…"
                : mode === "create"
                  ? "Создать сценарий"
                  : "Сохранить"}
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
      {confirmDiscard && (
        <DialogPortal>
          <BasicTemplateDialog
            header="Несохранённые изменения"
            action={
              <BaseActionCard>
                <Button styleType="text" onClick={() => setConfirmDiscard(false)}>
                  Остаться
                </Button>
                <Button
                  styleType="text"
                  onClick={() => {
                    setConfirmDiscard(false);
                    onCreateNew?.();
                  }}
                >
                  Отбросить и создать
                </Button>
              </BaseActionCard>
            }
            onHide={() => setConfirmDiscard(false)}
          >
            <Typography type="body">
              Текущие несохранённые изменения будут потеряны. Продолжить?
            </Typography>
          </BasicTemplateDialog>
        </DialogPortal>
      )}
    </div>
  );
}