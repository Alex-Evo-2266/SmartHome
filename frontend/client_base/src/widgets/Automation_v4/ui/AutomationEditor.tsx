import type { Automation, AutomationStep } from "@src/entites/automation_v4";
import { CapabilitiesContextProvider } from "@src/entites/automation_v4/context/capabilitiesContext";
import { createStep } from "@src/entites/automation_v4/helpers/createStep";
import { DialogPortal } from "@src/shared";
import { Sidebar } from "@src/shared/ui/SideBar";
import { BaseActionCard, BasicTemplateDialog, Button, DangerButton, Panel, TextField, Typography } from "alex-evo-sh-ui-kit";
import { useCallback, useState } from "react";

import { AutomationFlow } from "./flow/AutomationFlow";
import { AutomationSettingsPanel } from "./settings/AutomationSettingsPanel";
import type {
  EditorSelection,
  StepEditorKind,
  StepInsertTarget,
} from "../../../entites/automation_v4/helpers/editorTypes";

import "./AutomationEditor.scss";

interface AutomationEditorProps {
  automation: Automation;
  onChange: React.Dispatch<React.SetStateAction<Automation | null>>;
  onSave?: () => void;
  onCreateNew?: () => void;
  onDelete?:()=>void
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
  onDelete,
  mode = "edit",
  dirty = false,
  saving = false,
  creating = false,
}: AutomationEditorProps) {
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [stepDeleteError, setStepDeleteError] = useState<string | null>(null);

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

  function addStep(kind: StepEditorKind, target: StepInsertTarget) {
    const id = createId();
    const newStep = createStep(kind, id);

    onChange((previous) => {
      if (!previous) return previous;

      const steps = { ...previous.steps };

      if (target.type === "start") {
        steps[id] = { ...newStep, next: previous.entry || null };
        return { ...previous, steps, entry: id };
      }

      const previousStep = steps[target.stepId];
      if (!previousStep) return previous;

      if (target.type === "condition-branch") {
        if (previousStep.type !== "condition") return previous;

        const previousBranch =
          target.branch === "true"
            ? previousStep.on_true ?? null
            : previousStep.on_false ?? null;

        steps[id] = { ...newStep, next: previousBranch };
        steps[target.stepId] =
          target.branch === "true"
            ? { ...previousStep, on_true: id }
            : { ...previousStep, on_false: id };

        return { ...previous, steps };
      }

      steps[id] = { ...newStep, next: previousStep.next ?? null };
      steps[target.stepId] = { ...previousStep, next: id };

      return { ...previous, steps };
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
    if (automation.entry === id && automation.steps[id]?.type === "condition") {
      setStepDeleteError(
        "Нельзя удалить условие, которое является входом сценария. Сначала добавьте шаг перед ним.",
      );
      return;
    }

    setStepDeleteError(null);
    onChange((previous) => {
      if (!previous?.steps[id]) return previous;

      const deletedStep = previous.steps[id];
      const nextId =
        deletedStep.type === "condition" || deletedStep.next === id
          ? null
          : deletedStep.next ?? null;
      const replacement =
        nextId && previous.steps[nextId] ? nextId : null;
      const cleanedSteps: Automation["steps"] = {};

      for (const [stepId, step] of Object.entries(previous.steps)) {
        if (stepId === id) continue;

        const updated: AutomationStep = { ...step };
        if (updated.next === id) updated.next = replacement;
        if ("on_true" in updated && updated.on_true === id) {
          updated.on_true = replacement;
        }
        if ("on_false" in updated && updated.on_false === id) {
          updated.on_false = replacement;
        }
        if ("on_timeout" in updated && updated.on_timeout === id) {
          updated.on_timeout = replacement;
        }

        cleanedSteps[stepId] = updated;
      }

      const entry =
        previous.entry === id
          ? deletedStep.type === "condition"
            ? ""
            : replacement ?? ""
          : previous.entry;

      return { ...previous, steps: cleanedSteps, entry };
    });

    setSelection({ type: "start" });
  }

  return (
    <CapabilitiesContextProvider>
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
          {
            onDelete && 
            <DangerButton style={{background: "var(--Error-color)"}} text="удалить сценарий" header="удалить сценарий" onClick={onDelete}>удалить</DangerButton>
          }
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
        
      {stepDeleteError && (
        <div className="automation-editor__step-delete-error" role="alert">
          {stepDeleteError}
        </div>
      )}
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
    </CapabilitiesContextProvider>
  );
}