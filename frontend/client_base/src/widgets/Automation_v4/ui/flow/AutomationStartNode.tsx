import { Automation } from "@src/entites/automation_v4";
import { ListItem } from "alex-evo-sh-ui-kit";

interface AutomationStartNodeProps {
  automation: Automation;
  selected: boolean;
  onSelect: () => void;
}

const modeLabes = (automation: Automation)=>{
  if(automation.trigger.length > 0 && Object.keys(automation.parameters).length > 0){
    return "Начало шаблона"
  }
  else if(automation.trigger.length > 0){
    return "Запуск по триггерам"
  }
  else if(Object.keys(automation.parameters).length > 0){
    return "Функция с аргументами"
  }
  else{
    return "Функция без аргументов"
  }
};

export function AutomationStartNode({
  selected,
  onSelect,
  automation
}: AutomationStartNodeProps) {
  return (
    <ListItem 
        active={selected}
        className="automation-editor_step"
        header="Начало сценария"
        icon={
            "▶"
        }
        title={modeLabes(automation)}
        onClick={onSelect}
    />
  );
}