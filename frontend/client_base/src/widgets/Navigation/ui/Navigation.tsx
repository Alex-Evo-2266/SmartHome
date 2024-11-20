
import {NavigationBar, NavigationDrawer, NavigationRail, NavigationButton as NB, ScreenSize, useScreenSize} from 'alex-evo-sh-ui-kit'
import { Home, Menu, Plug } from "lucide-react"
import { useState } from "react"

export const Navigation = () => {

	const {screen} = useScreenSize()

	const [visible, setVisible] = useState<boolean>(false)

	const BarBtn:NB[] = [{
		text: "menu",
		type: "button",
		onClick: ()=>setVisible(prev=>!prev),
		icon: <Menu/>
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
			/>
	</>
	)
}