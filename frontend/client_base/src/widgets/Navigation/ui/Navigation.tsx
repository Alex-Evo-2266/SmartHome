
import {GearIcon, Home, LogoutIcon, MenuIcon, NavigationBar, NavigationDrawer, NavigationRail, NavigationButton as NB, Plug, Room, ScreenSize, useScreenSize} from 'alex-evo-sh-ui-kit'
import {useHttp} from "../../../shared/lib/hooks/http.hook"
import { useState } from "react"
import { useNavigationData } from '../../../entites/navigation'

export const Navigation = () => {

	const {screen} = useScreenSize()
	const {navigation, prefix} = useNavigationData()

	const [visible, setVisible] = useState<boolean>(false)

	const {logout} = useHttp()

	const BarBtn:NB[] = [{
		text: "menu",
		type: "button",
		onClick: ()=>setVisible(prev=>!prev),
		icon: <MenuIcon/>
	},
	{
		text: "home",
		type:"link",
		to: "/home",
		icon: <Home/>
	}
	]

	const RailBtn:NB[] = [
	{
		text: "home",
		type:"link",
		to: "/home",
		icon: <Home/>
	},
	{
		text: "device",
		type:"link",
		to: "/device",
		icon: <Plug/>
	},
	{
		text: "room",
		type:"link",
		to: "/room",
		icon: <Room/>
	},
	{
		text: "automation",
		type:"link",
		to: "/automation",
		icon: <Plug/>
	},
	{
		text: "settings",
		type: "link",
		to: "/settings",
		icon: <GearIcon/>
	},
	{
		text: "logout",
		type: "button",
		icon: <LogoutIcon/>,
		onClick() {
			logout()
		},
	}
	]

	if(screen === ScreenSize.MOBILE)
		return(
			<>
				<NavigationDrawer 
				onHide={()=>setVisible(false)}
				openAlways={false}
				visible={visible} 
				mainBtn={RailBtn} 
				otherBtn={navigation.map(item=>({to:`module_pages/${item.service}${item.path}`, text: item.page_name, type: "link", icon: <></>}))}
				/>
				<NavigationBar
					btns={BarBtn}
				/>
			</>
		)

	if(screen === ScreenSize.STANDART)
		return(
		<>
			<NavigationDrawer 
			onHide={()=>setVisible(false)}
			openAlways={false}
			visible={visible} 
			mainBtn={RailBtn} 
			otherBtn={navigation.map(item=>({to:`module_pages/${item.service}${item.path}`, text: item.page_name, type: "link", icon: <></>}))}
			/>
			<NavigationRail 
			onToggleMenu={()=>setVisible(prev=>!prev)} 
			mainBtn={RailBtn}
			/>
		</>
		)

	return(
	<>
		<NavigationDrawer 
			onHide={()=>setVisible(false)}
			openAlways={true}
			visible={visible} 
			mainBtn={RailBtn} 
			otherBtn={navigation.map(item=>({to:`module_pages/${item.service}${item.path}`, text: item.page_name, type: "link", icon: <></>}))}
			/>
	</>
	)
}