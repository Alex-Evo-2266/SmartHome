import { FilledButton } from "alex-evo-sh-ui-kit"

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