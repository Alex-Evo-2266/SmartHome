import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserAction } from "../store/reducers/userReducer"
import { useHttp } from "./http.hook"
import { useMessage } from "./message.hook"

export const useUser = ()=>{
	const dispatch = useDispatch()
	const {request, error, clearError} = useHttp()
	const auth = useSelector(state => state.auth)
	const {message} = useMessage()

	useEffect(()=>{
		message(error, 'error');
		clearError();
	},[error, message, clearError])

	const loadData = useCallback(async() =>{
		try{
			let data = await request("/api/user", "GET", null, {Authorization: `Bearer ${auth.token}`})
			if (data)
			{
				dispatch(setUserAction({
					name: data.name,
					email: data.email,
					id: data.id,
					auth_type: data.auth_type,
					image_url: data.image_url
				}))
			}
		}
		catch{}
	},[request, dispatch, auth.token])

	return {loadData}
}
