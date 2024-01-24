import { FilledTotalButton } from "../../../shared/ui"

interface AutomationButtonsProps{
    onAddAutomation:()=>void
}

export const AutomationButtons = ({onAddAutomation}:AutomationButtonsProps)=>{

    return(
        <div className="settings-navigation-button">
            <FilledTotalButton onClick={onAddAutomation}>add automation</FilledTotalButton>
        </div>
    )
} 