import { ScreenSize, useScreenSize } from "../../../entites/ScreenSize"

import {NavigationBar, NavigationDrawer, NavigationRail, NavigationButton as NB, NavigationBtn} from 'alex-evo-sh-ui-kit'
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { NavItem, getOtherNavigationItem, hideNavigation, toggleNavigation } from "../../../features/Navigation"
import { IconOrString } from "../../../entites/Icon"
import { NavigationButton } from "../../../features/Navigation/models/navigationItem"
import { Box, Home, LogOut, Menu, Plug } from "lucide-react"
import { logout } from "../../../entites/User"
import { useMemo } from "react"

export const Navigation = () => {

	const {screen} = useScreenSize()
	const navigation = useAppSelector(state=>state.navigation)
    const dispatch = useAppDispatch()

	const BarBtn:NB[] = [{
		text: "menu",
		type: "button",
		onClick: ()=>dispatch(toggleNavigation()),
		icon: <Menu/>
	},
	{
		text: "home",
		type:"link",
		to: "/home",
		icon: <Home/>
	},
	{
		text: "room",
		type: "link",
		to: "/room",
		icon: <Box/>
	}
	]

	const convertBtn = (btn: NavigationButton):undefined|NavigationBtn => {
		if(!btn)
			return btn
		return {
			type:"button",
			onClick: (e)=>btn.onClick(e as React.MouseEvent<HTMLElement, MouseEvent>),
			text: btn.text ?? "",
			icon: btn.icon
		}
	}

	const getBtns = (btns: NavItem[]):NB[] => {
		return btns.map(item=>({
			text:item.title,
			icon:<IconOrString iconName={item.icon}/>,
			to: item.url,
			type: "link"
		}))
	}

	const getFavouritesItems = (btns:NB[]):NB[] => {
		console.log("favor")
		btns.unshift({
			type:"link",
			text:"Devices",
			to:"/devices",
			icon:<Plug/>
		})
		btns.unshift({
			type:"link",
			text:"Home",
			to:"/home",
			icon:<Home/>
		})
		return btns
	}

	const favourBtns = useMemo(()=>getFavouritesItems(getBtns(navigation.favouritesItems)), [navigation.favouritesItems])
	const otherBtns = useMemo(()=>getBtns(getOtherNavigationItem(navigation.items, navigation.favouritesItems)), [navigation.items, navigation.favouritesItems])
	const btn = useMemo(()=>convertBtn(navigation.btn), [navigation.btn])

	if(screen === ScreenSize.MOBILE)
		return(
			<>
				<NavigationDrawer 
				onHide={()=>dispatch(hideNavigation())}
				openAlways={false}
				visible={navigation.visible} 
				firstBtn={btn} 
				mainBtn={favourBtns} 
				otherBtn={otherBtns}
				backBtn={{text:"Logout", icon:<LogOut/>, onClick:()=>dispatch(logout()), type:"button"}}
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
			onHide={()=>dispatch(hideNavigation())}
			openAlways={false}
			visible={navigation.visible} 
			firstBtn={btn} 
			mainBtn={favourBtns} 
			otherBtn={otherBtns}
			backBtn={{text:"Logout", icon:<LogOut/>, onClick:()=>dispatch(logout()), type:"button"}}
			/>
			<NavigationRail 
			backBtn={{text:"Logout", icon:<LogOut/>, onClick:()=>dispatch(logout()), type:"button"}} 
			onToggleMenu={()=>dispatch(toggleNavigation())} 
			firstBtn={btn} 
			mainBtn={favourBtns}
			/>
		</>
		)

	return(
	<>
		<NavigationDrawer 
			onHide={()=>dispatch(hideNavigation())}
			openAlways={true}
			visible={navigation.visible} 
			firstBtn={btn} 
			mainBtn={favourBtns} 
			otherBtn={otherBtns}
			backBtn={{text:"Logout", icon:<LogOut/>, onClick:()=>dispatch(logout()), type:"button"}}
			/>
	</>
	)
}