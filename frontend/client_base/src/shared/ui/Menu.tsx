import { useCallback } from 'react'
import {MENU_ROOT_ID} from '../../const'
import {useAppDispatch, useAppSelector} from "../lib/hooks/redux"
import {Menu as BaseMenu, ScreenSize, useScreenSize} from 'alex-evo-sh-ui-kit'
import { hideMenu } from '../lib/reducers/menuReducer'

export const Menu = () => {

	const menu = useAppSelector(state=>state.menu)
	const dispatch = useAppDispatch()
	const {screen} = useScreenSize()

	const hideHandler = useCallback(()=>{
		dispatch(hideMenu())
		menu.onHide?.()
	},[menu.onHide, dispatch])

	return(<BaseMenu 
		container={document.getElementById(MENU_ROOT_ID)}
		screensize={screen}
		visible={menu.visible} 
		blocks={menu.blocks} 
		width={menu.width} 
		autoHide={menu.autoHide} 
		onClick={menu.onClick} 
		onHide={hideHandler} 
		x={menu.x} 
		y={menu.y} 
		marginBottom={screen === ScreenSize.MOBILE?80:0}
		/>)
}

