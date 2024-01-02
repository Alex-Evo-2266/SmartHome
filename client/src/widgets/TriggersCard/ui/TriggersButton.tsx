import { FilledTotalButton } from "../../../shared/ui"

interface TriggersButtonsProps{
    onAddTrigger:()=>void
}

export const TriggersButtons = ({onAddTrigger}:TriggersButtonsProps)=>{

    return(
        <div className="settings-navigation-button">
            <FilledTotalButton onClick={onAddTrigger}>add trigger</FilledTotalButton>
        </div>
    )
} 