import React, { useCallback, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideMenu } from "../../lib/reducers/menuReducer"
import { Divider } from "../Divider/Divider"
import "./Menu.scss"
import { MenuBlock } from "./MenuBlock"
import { getModalWindowCord } from "../../lib/helpers/getModalCord"
import { hideBottomSheets, showBottomSheets } from "../../lib/reducers/bottomSheetsReducer"
import { SmallWindowMenu } from "./SmallWindowMenu"

const MENU_MARGIN_BOTTOM = 100

interface ICord{
	left: string
	top: string
}

export const Menu = () => {

	const menu = useAppSelector(state=>state.menu)
	const dispatch = useAppDispatch()


	const container = useRef<HTMLDivElement>(null)
	const [smallDisplay, setSmallDisplay] = useState<boolean>(false)
	const [cord, setCord] = useState<ICord>({left:"0px", top:"0px"})

	const hide = () => {
		dispatch(hideMenu())
	}

	const resize = useCallback(() => {
		if(!menu.visible)
			return
        if(window.innerWidth < 720)
		{
			setSmallDisplay(true)
			dispatch(showBottomSheets(<SmallWindowMenu/>, hide))
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
		window.addEventListener('resize', resize)
		return ()=>{
			window.removeEventListener('resize', resize)
		}
	},[resize])

	useEffect(()=>{
		let data = getModalWindowCord(menu.x, menu.y, container.current, {marginBottom: MENU_MARGIN_BOTTOM})
		setCord({
			left: data.x + "px", 
			top: data.y + "px",
		})
	},[menu.x, menu.y])

	if(!menu.visible)
		return null

	if(smallDisplay)
		return null

	return(
		<>
		<div ref={container} className="menu-container" style={{...cord, opacity:(cord.top !== "0px")?"100%":"0%", width:menu.width, maxWidth:(menu.width)?"100%":undefined}}>
		{
			menu.blocks.map((item, index)=>(
				<React.Fragment key={index}>
				{
					(index !== 0)?
					<Divider/>:
					null
				}
				<MenuBlock block={item} smallDisplay={false}/>
				</React.Fragment>
			))
		}
		</div>
		<div style={{zIndex: 1600}} className="backplate" onClick={hide}></div>
		</>
	)
}

