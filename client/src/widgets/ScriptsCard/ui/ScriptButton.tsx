import { FilledTotalButton } from "alex-evo-sh-ui-kit"

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