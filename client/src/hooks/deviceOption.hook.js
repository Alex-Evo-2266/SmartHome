import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHttp } from "./http.hook"
import { useMessage } from "./message.hook"
import { setOptions, setTypes } from "../store/reducers/optionAddDeviceReducer"

export const useDeviceOptions = () => {
	
	const {message} = useMessage()
	const auth = useSelector(state=>state.auth)
	const {request, error, clearError} = useHttp()
	const DeviceOptions = useSelector(state=>state.options)
	const dispatch = useDispatch()
	// const [options, setOptions] = useState([])
	// const [types, setTypes] = useState([])

	const loadOptions = useCallback(async()=>{
		const data = await request("/api/devices/options", "GET", null, {Authorization: `Bearer ${auth.token}`})
		if(data && Array.isArray(data))
			dispatch(setOptions(data))
	},[request, auth.token])

	const loadTypes = useCallback(async()=>{
		const data = await request("/api/devices/types", "GET", null, {Authorization: `Bearer ${auth.token}`})
		console.log(data)
		if(data && Array.isArray(data))
			dispatch(setTypes(data))
	},[request, auth.token])

	const getOptions = useCallback((class_device)=>{
		if(class_device)
		{
		  let d = DeviceOptions.options.filter((item)=>item.class_name === class_device)
		  return d[0]
		}
	  },[DeviceOptions.options])

	  const getType = useCallback((type_name)=>{
		if(type_name)
		{
		  let d = DeviceOptions.types.filter((item)=>item.name === type_name)
		  return d[0]
		}
	  },[DeviceOptions.types])

	useEffect(()=>{
		loadOptions()
	},[loadOptions])

	useEffect(()=>{
		loadTypes()
	},[loadTypes])

	useEffect(()=>{
		message(error, 'error');
		clearError();
		return ()=>clearError()
	},[error, message, clearError])

	return {loadOptions, loadTypes, getOptions, getType}
  }
  