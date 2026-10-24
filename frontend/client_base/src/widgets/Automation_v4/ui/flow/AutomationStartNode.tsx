import { ListItem } from "alex-evo-sh-ui-kit";
import type { EntryMode } from "../model/editorTypes";

interface AutomationStartNodeProps {
  mode: EntryMode;
  selected: boolean;
  onSelect: () => void;
}

const MODE_LABELS: Record<EntryMode, string> = {
  empty: "Без триггеров и аргументов",
  triggers: "Запуск по триггерам",
  function: "Функция с аргументами",
};

export function AutomationStartNode({
  mode,
  selected,
  onSelect,
}: AutomationStartNodeProps) {
  return (
    <ListItem 
        active={selected}
        className="automation-editor_step"
        header="Начало сценария"
        icon={
            "▶"
        }
        title={MODE_LABELS[mode]}
        onClick={onSelect}
    />
  );
}