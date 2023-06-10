import './NavigationDrawer.scss'
import { IconOrString } from '../../../../entites/Icon'
import { useAppDispatch, useAppSelector } from '../../../../shared/lib/hooks/redux'
import { Divider } from '../../../../shared/ui'
import { getOtherNavigationItem } from '../../../../features/Navigation'
import { Home, LogOut, Settings } from 'lucide-react'
import { NavigationDrawerItem } from './NavigationDrawerItem'
import { hideNavigation } from '../../../../features/Navigation/lib/reducers/NavigationReducer'
import { NavButton } from './NavButton'
import { logout } from '../../../../entites/User'

interface NavigationDrawerProps{
	openAlways?: boolean
}

export const NavigationDrawer = ({openAlways}:NavigationDrawerProps) => {

	const navigation = useAppSelector(state=>state.navigation)
	const dispatch = useAppDispatch()

	return(
		<>
		<div className={`navigation-drawer-container ${(navigation.visible || openAlways)?"show":"hide"}`}>
			<div className='navigation-block'>
				<div className='block-header'></div>
				<div className='block-content'>
					<NavigationDrawerItem onClick={()=>dispatch(hideNavigation())} title='Home' icon={<Home/>} to='/home'/>
				{
					navigation.favouritesItems.map((item, index)=>(
						<NavigationDrawerItem onClick={()=>dispatch(hideNavigation())} key={index} title={item.title} icon={<IconOrString iconName={item.icon}/>} to={item.url}/>
					))
				}
				</div>
			</div>
			<div className='divider-container'>
				<Divider/>
			</div>
			<div className='navigation-block'>
				<div className='block-header'></div>
				<div className='block-content'>
				{
					getOtherNavigationItem(navigation.items, navigation.favouritesItems).map((item, index)=>(
						<NavigationDrawerItem onClick={()=>dispatch(hideNavigation())} key={index} title={item.title} icon={<IconOrString iconName={item.icon}/>} to={item.url}/>
					))
				}
				<NavigationDrawerItem onClick={()=>dispatch(hideNavigation())} title='Settings' icon={<Settings/>} to='/settings'/>
				<NavButton onClick={()=>dispatch(logout())} title='Logout' icon={<LogOut/>}/>
				</div>
			</div>
		</div>
		{
			(navigation.visible && !openAlways)?
			<div className="backplate" style={{zIndex:1100}} onClick={()=>dispatch(hideNavigation())}></div>:
			null
		}
		</>
		
	)
}