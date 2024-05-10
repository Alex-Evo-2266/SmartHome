import { FilledButton } from "alex-evo-sh-ui-kit"

interface ServerSettingsButtonsProps{
    onSave:()=>void
}

export const ServerSettingsButtons = ({onSave}:ServerSettingsButtonsProps)=>{

    return(
        <div className="settings-navigation-button">
            <FilledButton onClick={onSave}>save</FilledButton>
        </div>
    )
} 