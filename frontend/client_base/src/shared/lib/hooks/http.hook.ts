import { baseAPI } from '@src/shared/api/baseAPI.js';
import { TypeRequest } from '@src/shared/api/type.js';
import { useAuth } from 'alex-evo-sh-auth';
import {useState, useCallback} from 'react'


export const useHttp = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const {logout, authManager} = useAuth()

	const request = useCallback(async (url:string, method:TypeRequest = TypeRequest.GET, body?:Dict<unknown> | Dict<unknown>[], headers:Dict<unknown> = {}, file:boolean = false, throwOnError = false) => {
		if(!authManager) {
			if (throwOnError) {
				const authError = new Error("Авторизация недоступна")
				setError(authError.message)
				throw authError
			}
			return
		}
		setLoading(true);
		try {
			headers = {
				...headers, 
			}
			const response = await baseAPI(authManager, url, method, body, headers ,file, logout)

			const data = await response.json()
			if (!response.ok) {
				throw new Error((data)?JSON.stringify(data):'что-то пошло не так')
			}
			setLoading(false);
			return data;
		} catch (e) {
			setLoading(false);
			setError(e instanceof Error ? e.message : String(e))
			if (throwOnError) {
				throw e instanceof Error ? e : new Error(String(e))
			}
		}
	},[authManager, logout]);

	const clearError = useCallback(() => {setError(null)},[]);

	const userLogout = useCallback(()=>logout(),[logout])

	return {loading, request, error, clearError, logout:userLogout}
}
