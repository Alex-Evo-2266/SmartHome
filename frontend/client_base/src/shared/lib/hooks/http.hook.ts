import {useState, useCallback} from 'react'

import { useAppDispatch } from './redux.js';
import { baseAPI } from '@src/shared/api/baseAPI.js';
import { TypeRequest } from '@src/shared/api/type.js';
import { logout } from '../reducers/userAuthDataReducer.js';

export const useHttp = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useAppDispatch()

	const request = useCallback(async (url:string, method:TypeRequest = TypeRequest.GET, body?:Dict<unknown> | Dict<unknown>[], headers:Dict<unknown> = {}, file:boolean = false) => {
		setLoading(true);
		try {
			headers = {
				...headers, 
			}
			let response = await baseAPI(url, method, body, headers ,file)

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
	},[]);

	const clearError = useCallback(() => {setError(null)},[]);

	const userLogout = useCallback(()=>dispatch(logout()),[dispatch])

	return {loading, request, error, clearError, logout:userLogout}
}
