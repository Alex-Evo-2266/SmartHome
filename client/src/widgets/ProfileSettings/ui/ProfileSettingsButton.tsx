import { FilledButton } from "../../../shared/ui"

interface ProfileSettingsButtonsProps{
    onSave:()=>void
}

export const ProfileSettingsButtons = ({onSave}:ProfileSettingsButtonsProps)=>{

    return(
        <div className="settings-navigation-button">
            <FilledButton onClick={onSave}>save</FilledButton>
        </div>
    )
} 