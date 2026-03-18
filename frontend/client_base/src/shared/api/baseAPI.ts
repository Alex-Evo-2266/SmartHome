import { apiFetch, AuthManager } from "alex-evo-sh-auth";
import { TypeRequest } from "./type";

export const baseAPI = async(authManager: AuthManager, url:string, method: TypeRequest = TypeRequest.GET, body:Dict<unknown> | Dict<unknown>[] |undefined | null = undefined, headers:Dict<unknown> = {}, file:boolean = false) => {
	let newBody: BodyInit | undefined | null = undefined
	if(body && !file){
		headers['Content-Type'] = 'application/json'
		newBody = JSON.stringify(body);
	}
	console.log(url, {method, body: newBody, headers})
	const response = await apiFetch(authManager, url, {method, body: newBody, headers: (headers as Record<string, string>)});
	return response
}
