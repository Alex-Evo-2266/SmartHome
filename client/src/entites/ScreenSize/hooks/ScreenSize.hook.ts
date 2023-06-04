import { useCallback, useEffect, useState } from "react"
import { ScreenSize } from "../models/SizeScreen"


export const useScreenSize = () => {

    const [screen, setScreen] = useState<ScreenSize>(ScreenSize.STANDART)

	const resize = useCallback(() => {
		if(window.innerWidth < 720)
			setScreen(ScreenSize.MOBILE)
		else if(window.innerWidth < 1400)
			setScreen(ScreenSize.STANDART)
		else
			setScreen(ScreenSize.BIG_SCREEN)
	},[window.innerWidth])

	useEffect(()=>{
		resize()
	},[resize])

	useEffect(()=>{
		window.addEventListener('resize', resize)
		return ()=>{
			window.removeEventListener('resize', resize)
		}
	},[resize])

    return{screen}
}