import type { Automation } from "@src/entites/automation_v4";
import { Typography } from "alex-evo-sh-ui-kit";

import { FunctionArgumentsEditor } from "./FunctionArgumentsEditor";
import styles from "./StartSettings.module.scss";
import { TriggerEditor } from "./TriggerEditor";

interface StartSettingsProps {
  automation: Automation;
  onChange: (patch: Partial<Automation>) => void;
}

export function StartSettings({
  automation,
  onChange,
}: StartSettingsProps) {
  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <Typography type="small" className={styles.eyebrow}>
          НАСТРОЙКИ СТАРТА
        </Typography>
        <Typography type="title-2">Начало сценария</Typography>
        <Typography type="small" className={styles.description}>
          Настройте условия запуска и аргументы сценария.
        </Typography>
      </header>

      <div className={styles.groups}>
        <TriggerEditor
          triggers={automation.trigger}
          onChange={(trigger) => onChange({ trigger })}
        />

        <FunctionArgumentsEditor
          parameters={automation.parameters}
          onChange={(parameters) => onChange({ parameters })}
        />
      </div>
    </div>
  );
}
