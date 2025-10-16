import { Outlet } from "react-router-dom"
import { ScreenSize, useScreenSize } from "alex-evo-sh-ui-kit"
import { useNavigationData } from '../../../entites/navigation'
import { getBarButtons, Navigation, useMainButtons } from "@src/widgets/Navigation"
import { Menu } from "@src/shared"
import './Root.scss'
import { getHidenBtn } from "@src/widgets/Navigation/config/hidenBtn"

export const RootPage = () => {

    const {screen} = useScreenSize()
	const {navigation} = useNavigationData()
	const mainBtn = useMainButtons()

	const getStyleClass = (screen: ScreenSize) => {
		if(screen === ScreenSize.BIG_SCREEN)
			return "big"
		if(screen === ScreenSize.MOBILE)
			return "mobile"
		if(screen === ScreenSize.STANDART)
			return ""
	}

    return(
			<div className="root-page">
				<Menu/>
				<Navigation mainBtn={mainBtn} otherBtn={getHidenBtn(navigation)} barBtn={getBarButtons()}/>
				<div className={`root-container ${getStyleClass(screen)}`}>
					<Outlet/>
				</div>
			</div>	
    )
}