import { Button } from "../../../shared/ui"

interface ServerSettingsButtonsProps{
    onSave:()=>void
}

export const ServerSettingsButtons = ({onSave}:ServerSettingsButtonsProps)=>{

    return(
        <div className="settings-navigation-button">
            <Button onClick={onSave}>save</Button>
        </div>
    )
} 