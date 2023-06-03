import { TypeRequest } from "./type";

export const baseAPI = async(url:string, method: TypeRequest = TypeRequest.GET, body:Dict | undefined | null = undefined, headers:Dict = {}, file:boolean = false) => {
	let newBody: BodyInit | undefined | null = undefined
	if(body && !file){
		headers['Content-Type'] = 'application/json'
		newBody = JSON.stringify(body);
	}
	let response = await fetch(url, {method, body: newBody, headers});
	return response
}

export const APIWitchToken = async(url:string, method: TypeRequest = TypeRequest.GET, body:Dict | undefined | null = undefined, token:string, headers:Dict = {}, file:boolean = false) => {
	headers["Authorization"] = "Bearer " + token
	return await baseAPI(url, method, body, headers, file)
}