import { SettingsEditor } from "../../../widgets/ServerConfig"

export const SettingsPage = () => {

    return(
        <div className="settings-page container-page">
            <SettingsEditor config_prefix="/api-devices" header="Server settings"/>
            <SettingsEditor config_prefix="/api-modules-manager" header="Manager settings"/>
        </div>
    )
}