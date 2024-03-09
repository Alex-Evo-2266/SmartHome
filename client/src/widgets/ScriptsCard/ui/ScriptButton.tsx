import { FilledTotalButton } from "../../../shared/ui"

interface ScriptButtonsProps{
    onAddScript:()=>void
}

export const ScriptButtons = ({onAddScript}:ScriptButtonsProps)=>{

    return(
        <div className="settings-navigation-button">
            <FilledTotalButton onClick={onAddScript}>add script</FilledTotalButton>
        </div>
    )
} 