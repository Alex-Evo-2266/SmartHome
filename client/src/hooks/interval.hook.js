import {useRef} from 'react'

export const useInterval = (fun, delay = 10000)=>{
	if (typeof(fun) !== "function")
		throw new Error('hook arg - function')
	
	const idTimer = useRef(null)

	const callFunction = useCallback(()=>{
		if (idTimer.current)
		{
			clearInterval(idTimer.current)
			idTimer.current = null
		}
		if (typeof(fun) === "function")
			fun()
		idTimer.current = setInterval(()=>{
			callFunction()
		}, delay)
	},[])
	
	const start = useCallback(() => {
		if (idTimer.current == null)
			callFunction()
	},[callFunction])

	const stop = useCallback(() => {
		if (idTimer.current)
			clearInterval(idTimer.current)
	},[])

	return {start, stop}

}
