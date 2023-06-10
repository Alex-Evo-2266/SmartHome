import { UserRole } from '../../../entites/User'
import { useAppSelector } from '../../../shared/lib/hooks/redux'
import { SettingsNavigationTable } from '../../../widgets/NavigationSettings'
import { ProfileSettings } from '../../../widgets/ProfileSettings'
import { ServerSettings } from '../../../widgets/ServerSettings'
import './SettingsPage.scss'

export const SettingsPage = () => {

    const auth = useAppSelector(state=>state.auth)

    return(
        <div className="settings-page-container">
            <div className='navigete-settings'>
                <SettingsNavigationTable />
            </div>
            {
                (auth.role === UserRole.ADMIN)?
                <div className='server-settings'>
                    <ServerSettings/>
                </div>:
                null
            }
            <div className='profile-settings'>
                <ProfileSettings />
            </div>
            {/* <Profile className='profile-settings'/> */}
        </div>
    )
}