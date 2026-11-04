import type { Automation } from "@src/entites/automation_v4";
import { TriggerEditor } from "./TriggerEditor";
import { Typography } from "alex-evo-sh-ui-kit";
import { FunctionArgumentsEditor } from "./FunctionArgumentsEditor";

interface StartSettingsProps {
  automation: Automation;
  onChange: (patch: Partial<Automation>) => void;
}

export function StartSettings({
  automation,
  onChange,
}: StartSettingsProps) {

  return (

    <div className="automation-settings">
        <Typography type="heading">Начало сценария</Typography>

        <TriggerEditor
          triggers={automation.trigger}
          onChange={(trigger) => onChange({ trigger })}
        />

        <FunctionArgumentsEditor
          parameters={automation.parameters}
          onChange={(parameters) => onChange({ parameters })}
        />

    </div>
  );
}

