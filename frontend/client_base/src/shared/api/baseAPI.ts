import { refresh } from "./refresh";
import { TypeRequest } from "./type";

export const baseAPI = async(url:string, method: TypeRequest = TypeRequest.GET, body:Dict<unknown> | Dict<unknown>[] |undefined | null = undefined, headers:Dict<unknown> = {}, file:boolean = false) => {
	let newBody: BodyInit | undefined | null = undefined
	if(body && !file){
		headers['Content-Type'] = 'application/json'
		newBody = JSON.stringify(body);
	}
	console.log(url, {method, body: newBody, headers})
	const response = await fetch(url, {method, body: newBody, headers: (headers as Record<string, string>)});
	return response
}

export const APIWitchToken = async(url:string, method: TypeRequest = TypeRequest.GET, body:Dict<unknown> | Dict<unknown>[] | undefined | null = undefined, token:string | undefined | null, headers:Dict<unknown> = {}, file:boolean = false) => {
	if(token){
		headers["Authorization"] = token
	}
	return await baseAPI(url, method, body, headers, file)
}

export const requestWithRefrash = async (
	url:string, 
	method: TypeRequest = TypeRequest.GET, 
	body:Dict<unknown> | Dict<unknown>[] | undefined | null = undefined, 
	token:string | undefined | null = null, 
	headers:Dict<unknown> = {}, 
	onErrorRefrash?:()=>void, 
	onSuccessRefrash?:(data:unknown)=>void,
	file: boolean = false
) => {
	let response = await APIWitchToken(url, method, body, token, headers, file)
	if (response.status === 401){
		const newToken = await refresh(
			onErrorRefrash,
			onSuccessRefrash
		)
		if(!newToken)
			throw new Error("invalid token")
		response = await APIWitchToken(url, method, body, newToken, headers, file)
	}
	const data = await response.json()
	if (!response.ok) {
		throw new Error((data)?JSON.stringify(data):'что-то пошло не так')
	}
	return data
}