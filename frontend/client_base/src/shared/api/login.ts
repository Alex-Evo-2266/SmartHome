import { LoginData, LoginRequestData } from "../lib/model/authData";
import { baseAPI } from "./baseAPI";
import { TypeRequest } from "./type";

const LOGIN_URL = "/api-auth/login"

export const login = async(form: LoginRequestData):Promise<LoginData>=>{
	const response = await baseAPI(LOGIN_URL, TypeRequest.POST, {...form});
	const token = response.headers.get('Authorization')
	const id = response.headers.get('X-User-Id')
	const date = response.headers.get('X-Token-Expires-At')
	const role = response.headers.get('X-User-Role')
	const data = await response.json()
	if(!token || !id || !date || !role){
		throw Error("error auth data")
	}
	if (!response.ok) {
		throw new Error(data.message||'что-то пошло не так')
	}
	return {token, id, expires_at:date, role}
}