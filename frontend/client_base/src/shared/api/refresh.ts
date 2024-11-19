import { RefrashData } from "../lib/model/authData";
import { TypeRequest } from "./type";

const REFRESH_URL = "/api-auth/refresh"

export const refresh = async(onError?:()=>void, onSuccess?:(data:RefrashData)=>void)=>{
	const response = await fetch(REFRESH_URL, {method:TypeRequest.GET, body:null, headers:{}});
	const token = response.headers.get('Authorization')
	const id = response.headers.get('X-User-Id')
	const date = response.headers.get('X-Token-Expires-At')
	const role = response.headers.get('X-User-Role')
	const data = await response.json()
	if(!token || !id || !date || !role){
		throw Error("error auth data")
	}
	if (!response.ok) {
		onError && await onError()
		throw new Error(data.message||'что-то пошло не так')
	}
	onSuccess && await onSuccess({token, id, expires_at:date, role})
	return token
}