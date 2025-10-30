import { SettingsEditor } from "../../../widgets/ServerConfig"

export const SettingsPage = () => {

    return(
        <div className="settings-page container-page" style={{display: "flex", flexDirection: "column", gap: "5px"}}>
            <SettingsEditor config_prefix="/api-devices" header="Server settings"/>
            <SettingsEditor config_prefix="/api-modules-manager" header="Manager settings"/>
        </div>
    )
}