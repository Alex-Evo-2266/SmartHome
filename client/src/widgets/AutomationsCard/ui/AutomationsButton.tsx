import { FilledTotalButton } from "alex-evo-sh-ui-kit"

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