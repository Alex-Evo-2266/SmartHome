import {MENU_ROOT_ID} from '../../const'
import {useAppSelector} from "../lib/hooks/redux"
import {Menu as BaseMenu, useScreenSize} from 'alex-evo-sh-ui-kit'

export const Menu = () => {

	const menu = useAppSelector(state=>state.menu)
	const {screen} = useScreenSize()

	return(<BaseMenu 
		container={document.getElementById(MENU_ROOT_ID)}
		screensize={screen}
		visible={menu.visible} 
		blocks={menu.blocks} 
		width={menu.width} 
		autoHide={menu.autoHide} 
		onClick={menu.onClick} 
		onHide={menu.onHide} 
		x={menu.x} 
		y={menu.y} 
		/>)
}

