import { ScreenSize, useScreenSize } from "../../../entites/ScreenSize"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { NavigationBar } from "./NavigationBar/NavigationBar"
import { NavigationDrawer } from "./NavigationDrawer/NavigationDrawer"
import { NavigationRail } from "./NavigationRail/NavigationRail"
import { SearchBar } from "./SearchBar/SearchBar"


export const Navigation = () => {

	const {screen} = useScreenSize()
	const navigation = useAppSelector(state=>state.navigation)

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
			{
				(navigation.search)?
				<SearchBar/>:
				null
			}
		</>
		)

	return(
	<>
		<NavigationDrawer openAlways/>
		{
			(navigation.search)?
			<SearchBar left="350px"/>:
			null
		}
	</>
	)
}