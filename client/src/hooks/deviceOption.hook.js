import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHttp } from "./http.hook"
import { useMessage } from "./message.hook"

export const useDeviceOptions = () => {
	
	const {message} = useMessage()
	const auth = useSelector(state=>state.auth)
	const {request, error, clearError} = useHttp()
	const [options, setOptions] = useState([])

	const loadOptions = useCallback(async()=>{
		const data = await request("/api/devices/options", "GET", null, {Authorization: `Bearer ${auth.token}`})
		if(data && Array.isArray(data))
		  setOptions(data)
	},[request, auth.token])

	const getOptions = useCallback((class_device)=>{
		if(class_device)
		{
		  let d = options.filter((item)=>item.class_name === class_device)
		  return d[0]
		}
	  },[options])

	useEffect(()=>{
		loadOptions()
	},[loadOptions])

	useEffect(()=>{
		message(error, 'error');
		clearError();
		return ()=>clearError()
	},[error, message, clearError])

	return {loadOptions, getOptions, options}
  }
  