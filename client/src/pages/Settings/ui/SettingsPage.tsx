import { SettingsNavigationTable } from '../../../widgets/NavigationSettings'
import { ServerSettings } from '../../../widgets/ServerSettings'
import './SettingsPage.scss'

export const SettingsPage = () => {


    return(
        <div className="settings-page-container">
            <SettingsNavigationTable/>
            <ServerSettings/>
        </div>
    )
}