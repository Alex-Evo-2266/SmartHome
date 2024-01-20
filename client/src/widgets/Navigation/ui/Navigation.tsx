import { ScreenSize, useScreenSize } from "../../../entites/ScreenSize"
import { NavigationBar } from "./NavigationBar/NavigationBar"
import { NavigationDrawer } from "./NavigationDrawer/NavigationDrawer"
import { NavigationRail } from "./NavigationRail/NavigationRail"


export const Navigation = () => {

	const {screen} = useScreenSize()

	if(screen === ScreenSize.MOBILE)
		return(
			<>
				<NavigationDrawer/>
				<NavigationBar/>
			</>
		)

	if(screen === ScreenSize.STANDART)
		return(
		<>
			<NavigationDrawer/>
			<NavigationRail/>
		</>
		)

	return(
	<>
		<NavigationDrawer openAlways/>
	</>
	)
}