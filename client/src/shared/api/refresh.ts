import { TypeRequest } from "./type";

const REFRESH_URL = "/api/auth/refresh"

export const refresh = async(onError?:()=>void, onSuccess?:(data:any)=>void)=>{
	const response = await fetch(REFRESH_URL, {method:TypeRequest.GET, body:null, headers:{}});
	const data = await response.json()
	if (!response.ok) {
		onError && await onError()
		throw new Error(data.message||'что-то пошло не так')
	}
	onSuccess && await onSuccess(data)
	return data.token as string
}