import {useState, useCallback} from 'react'
import { APIWitchToken, baseAPI } from '../../../../shared/api/baseAPI.js'
import { TypeRequest } from '../../../../shared/api/type.js'
import { refresh } from '../../../../shared/api/refresh.js';
import { LoginData, login, logout } from '../../../../entites/User/index.js';
import { useAppDispatch } from '../../../../shared/lib/hooks/redux.js';


export const useHttp = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useAppDispatch()

	const request = useCallback(async (url:string, method:TypeRequest = TypeRequest.GET, body?:Dict, headers:Dict = {}, file:boolean = false) => {
		setLoading(true);
		try {
			let response = await baseAPI(url, method, body, headers ,file)
			if (response.status === 401){
				const token = await refresh(
					()=>dispatch(logout()), 
					(data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
				)
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
	},[dispatch]);

	const clearError = useCallback(() => {setError(null)},[]);

	return {loading, request, error, clearError}
}
