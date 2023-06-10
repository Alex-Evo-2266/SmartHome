import { FilledButton } from "../../../shared/ui"

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