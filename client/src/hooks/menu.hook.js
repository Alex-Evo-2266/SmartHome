import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAllFields, setUserFields } from "../store/reducers/menuReducer"
import { useHttp } from "./http.hook"
import { useMessage } from "./message.hook"

export const useMenu = ()=>{
	const dispatch = useDispatch()
	const {request, error, clearError} = useHttp()
	const auth = useSelector(state => state.auth)
	const {message} = useMessage()

	useEffect(()=>{
		message(error, 'error');
		clearError();
	},[error, message, clearError])

	const loadAllFields = useCallback(async()=>{
		let data = await request("/api/menu/all", "GET", null, {Authorization: `Bearer ${auth.token}`})
		if (data)
		{
			dispatch(setAllFields(data))
		}
	},[request, dispatch, auth.token])

	const loadUserFields = useCallback(async()=>{
		let data = await request("/api/menu", "GET", null, {Authorization: `Bearer ${auth.token}`})
		if (data)
		{
			dispatch(setUserFields(data))
		}
	},[request, dispatch, auth.token])

	const loadMenuData = useCallback(async() =>{
		try{
			await loadAllFields()
			await loadUserFields()
		}
		catch{}
	},[loadAllFields, loadUserFields])

	return {loadMenuData, loadAllFields, loadUserFields}
}
