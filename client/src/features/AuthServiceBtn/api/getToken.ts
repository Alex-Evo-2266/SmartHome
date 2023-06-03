import { LoginData } from "../../../entites/User";
import { baseAPI } from "../../../shared/api/baseAPI";
import { TypeRequest } from "../../../shared/api/type";

const AUTH_PATH = '/api/auth'

export const getToken = async(code:string)=>{
	const response = await baseAPI(AUTH_PATH, TypeRequest.POST, {"code": code})
	if(!response.ok)
		return;
	console.log(response)
	let data: LoginData = await response.json()
	if (!data) 
		return ;
	return data
  }