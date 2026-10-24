import type { Automation } from "@src/entites/automation_v4";
import type { EntryMode } from "../model/editorTypes";
import { TriggerEditor } from "./TriggerEditor";
import FunctionArgumentsEditor from "./FunctionArgumentsEditor";
import { SelectField } from "@src/shared";
import { Typography } from "alex-evo-sh-ui-kit";

interface StartSettingsProps {
  mode: EntryMode;
  automation: Automation;
  onModeChange: (mode: EntryMode) => void;
  onChange: (patch: Partial<Automation>) => void;
}

export function StartSettings({
  mode,
  automation,
  onModeChange,
  onChange,
}: StartSettingsProps) {
  function changeMode(nextMode: EntryMode) {
    onModeChange(nextMode);

    if (nextMode === "triggers") {
      onChange({
        trigger: automation.trigger,
        parameters: {},
      });
    } else {
      onChange({
        trigger: [],
        parameters: automation.parameters,
      });
    }
  }

  return (

    <div className="automation-settings">
        <Typography type="heading">Начало сценария</Typography>
        <Typography type="body">Выберите способ запуска. В одном сценарии используются
          либо триггеры, либо аргументы функции.</Typography>

      <SelectField
        placeholder="Формат сценария"
        border
        items={[
            {title: "по триггеру", value: "triggers"},
            {title: "функция", value: "function"}
        ]}
        value={mode}
        onChange={(data:any)=>changeMode(data)}
      />

      {mode === "triggers" && (
        <TriggerEditor
          triggers={automation.trigger}
          onChange={(trigger) => onChange({ trigger })}
        />
      )}

      {mode === "function" && (
        <FunctionArgumentsEditor
          parameters={automation.parameters}
          onChange={(parameters) => onChange({ parameters })}
        />
      )}

    </div>
  );
}

