import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideMenu } from "../../lib/reducers/menuReducer"
import { hideBottomSheets, showBottomSheets } from "../../lib/reducers/bottomSheetsReducer"

import {Menu as BaseMenu, SmallWindowMenu} from 'alex-evo-sh-ui-kit'


export const Menu = () => {

	const menu = useAppSelector(state=>state.menu)
	const dispatch = useAppDispatch()

	const [smallDisplay, setSmallDisplay] = useState<boolean>(false)

	const hide = useCallback(() => {
		if(menu.onHide)
			menu.onHide()
		else
			dispatch(hideMenu())
	},[menu.onHide])

	const resize = useCallback(() => {
		if(!menu.visible)
			return
        if(window.innerWidth < 720)
		{
			setSmallDisplay(true)
			dispatch(showBottomSheets(
			<SmallWindowMenu 
			visible={menu.visible} 
			blocks={menu.blocks} 
			width={menu.width} 
			autoHide={menu.autoHide} 
			onClick={menu.onClick} 
			onHide={menu.onHide}
			/>, hide))
		}
        else
		{
			setSmallDisplay(false)
			dispatch(hideBottomSheets())
		}
    },[window.innerWidth, dispatch, menu.visible])

    useEffect(()=>{
        resize()
    },[resize])

	useEffect(()=>{
		if(!menu.visible)
			dispatch(hideBottomSheets())
	},[menu.visible])

	useEffect(()=>{
		window.addEventListener('resize', resize)
		return ()=>{
			window.removeEventListener('resize', resize)
		}
	},[resize])

	if(smallDisplay)
		return null

	return(<BaseMenu visible={menu.visible} 
		blocks={menu.blocks} 
		width={menu.width} 
		autoHide={menu.autoHide} 
		onClick={menu.onClick} 
		onHide={menu.onHide} 
		x={menu.x} 
		y={menu.y} 
		/>)
}

