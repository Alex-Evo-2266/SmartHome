import { Outlet } from "react-router-dom"
import { Navigation } from '../../../widgets/Navigation'
import { ColorProvider, ScreenSize, SizeProvider, useScreenSize } from "alex-evo-sh-ui-kit"
import './Root.scss'

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

    return(
		<ColorProvider>
		<SizeProvider>
			<div className="root-page">
				<Navigation/>
				<div className={`root-container ${getStyleClass(screen)}`}>
					<Outlet/>
				</div>
			</div>	
		</SizeProvider>
		</ColorProvider>
    )
}