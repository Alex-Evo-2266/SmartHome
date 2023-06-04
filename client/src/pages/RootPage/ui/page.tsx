import { Outlet } from "react-router-dom"
import { Navigation } from "../../../widgets/Navigation"
import './rootContainer.scss'
import { ScreenSize, useScreenSize } from "../../../entites/ScreenSize"

export const RootPage = () => {

	const {screen} = useScreenSize()

	const getStyleClass = (screen: ScreenSize) => {
		if(screen === ScreenSize.BIG_SCREEN)
			return "big"
		if(screen === ScreenSize.MOBILE)
			return "mobile"
		if(screen === ScreenSize.STANDART)
			return ""
	}

	return (
		<>
			<Navigation/>
			<div className={`root-container ${getStyleClass(screen)}`}>
				<Outlet/>
			</div>
		</>
		
	)
}