import type {
  Automation,
  AutomationStep,
} from "@src/entites/automation_v4";

import { StartSettings } from "./StartSettings";
import type {
  EditorSelection,
} from "../../../../entites/automation_v4/helpers/editorTypes";
import { getStepEditorKind } from "../../../../entites/automation_v4/helpers/editorTypes";
import { ActionStepEditor } from "./steps/ActionStepEditor/ActionStepEditor";
import { AwaitStepEditor } from "./steps/AwaitStepEditor";
import { ConditionStepEditor } from "./steps/ConditionStepEditor";
import { DelayStepEditor } from "./steps/DelayStepEditor";
import { ScriptActionStepEditor } from "./steps/ScriptActionStepEditor";
import { useActionCommands } from "./steps/ActionStepEditor/hooks/useActionCommands";

interface AutomationSettingsPanelProps {
  automation: Automation;
  selection: EditorSelection | null;
  onChange: (patch: Partial<Automation>) => void;
  onExpressionsChange: (
    update: (expressions: Automation["expressions"]) => Automation["expressions"],
  ) => void;
  onStepChange: (id: string, step: AutomationStep) => void;
  onStepDelete: (id: string) => void;
}

export function AutomationSettingsPanel({
  automation,
  selection,
  onChange,
  onExpressionsChange,
  onStepChange,
  onStepDelete,
}: AutomationSettingsPanelProps) {

    const {
      capabilities,
    } = useActionCommands();

  if(selection === null) return null

  if (selection.type === "start") {
    return (
      <StartSettings
        capabilities={capabilities}
        automation={automation}
        onChange={onChange}
        expressions={automation.expressions}
        onExpressionsChange={onExpressionsChange}
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
    parameters: automation.parameters,
    expressions: automation.expressions,
    onChange: (nextStep: AutomationStep) =>
      onStepChange(selection.id, nextStep),
    onDelete: () => onStepDelete(selection.id),
    onExpressionChange: onExpressionsChange,
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