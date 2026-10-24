import type {
  Automation,
  AutomationStep,
} from "@src/entites/automation_v4";

import type {
  EditorSelection,
  EntryMode,
} from "../model/editorTypes";

import { getStepEditorKind } from "../model/editorTypes";
import { StartSettings } from "./StartSettings";

import { ActionStepEditor } from "./steps/ActionStepEditor";
import { DelayStepEditor } from "./steps/DelayStepEditor";
import { ConditionStepEditor } from "./steps/ConditionStepEditor";
import { AwaitStepEditor } from "./steps/AwaitStepEditor";
import { ScriptActionStepEditor } from "./steps/ScriptActionStepEditor";

interface AutomationSettingsPanelProps {
  automation: Automation;
  selection: EditorSelection | null;
  entryMode: EntryMode;
  onChange: (patch: Partial<Automation>) => void;
  onEntryModeChange: (mode: EntryMode) => void;
  onStepChange: (id: string, step: AutomationStep) => void;
  onStepDelete: (id: string) => void;
}

export function AutomationSettingsPanel({
  automation,
  selection,
  entryMode,
  onChange,
  onEntryModeChange,
  onStepChange,
  onStepDelete,
}: AutomationSettingsPanelProps) {
  if(selection === null) return null

  if (selection.type === "start") {
    return (
      <StartSettings
        mode={entryMode}
        automation={automation}
        onModeChange={onEntryModeChange}
        onChange={onChange}
      />
    );
  }

  const step = automation.steps[selection.id];

  if (!step) {
    return (
      <div className="automation-settings__empty">
        <span>Шаг не найден</span>
        <p>Выберите другой шаг.</p>
      </div>
    );
  }

  const editorProps = {
    key: selection.id,
    step,
    onChange: (nextStep: AutomationStep) =>
      onStepChange(selection.id, nextStep),
    onDelete: () => onStepDelete(selection.id),
  };

  switch (getStepEditorKind(step)) {
    case "action":
      return <ActionStepEditor {...editorProps} />;

    case "delay":
      return <DelayStepEditor {...editorProps} />;

    case "condition":
      return <ConditionStepEditor {...editorProps} />;

    case "await":
      return <AwaitStepEditor {...editorProps} />;

    case "script":
      return <ScriptActionStepEditor {...editorProps} />;
  }
}