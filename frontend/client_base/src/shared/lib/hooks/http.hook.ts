import {useState, useCallback} from 'react'

import { useAppDispatch, useAppSelector } from './redux.js';
import { APIWitchToken, baseAPI } from '../../api/baseAPI.js'
import { refresh } from '../../api/refresh.js';
import { TypeRequest } from '../../api/type.js'
import { LoginData } from '../model/authData.js';
import { login, logout } from '../reducers/userAuthDataReducer.js';


export const useHttp = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useAppDispatch()
	const {token} = useAppSelector(state=>state.auth)

	const request = useCallback(async (url:string, method:TypeRequest = TypeRequest.GET, body?:Dict<unknown> | Dict<unknown>[], headers:Dict<unknown> = {}, file:boolean = false) => {
		setLoading(true);
		try {
			headers = {
				...headers, 
				Authorization: token
			}
			let response = await baseAPI(url, method, body, headers ,file)
			if (response.status === 401){
				const token = await refresh(
					()=>dispatch(logout()), 
					(data:LoginData)=>dispatch(login(data.token, data.id, data.role ?? "", new Date(data.expires_at)))
				)
				if(!token)
					throw new Error("invalid token")
				response = await APIWitchToken(url, method, body, token, headers ,file)
			}
			const data = await response.json()
			if (!response.ok) {
				throw new Error((data)?JSON.stringify(data):'что-то пошло не так')
			}
			setLoading(false);
			return data;
		} catch (e) {
			setLoading(false);
			if(typeof e === "string")
				setError(e)
			else if(e instanceof Error)
				setError(e.message)
		}
	},[dispatch, token]);

	const clearError = useCallback(() => {setError(null)},[]);

	const userLogout = useCallback(()=>dispatch(logout()),[dispatch])

	return {loading, request, error, clearError, logout:userLogout}
}
