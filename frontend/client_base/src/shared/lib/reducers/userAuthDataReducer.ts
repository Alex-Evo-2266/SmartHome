import { logoutInSession } from "../../api/logout";

const SMARTHOME_USER_DATA = 'smarthome_user_data';

enum TypeAction{
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT"
}

interface AuthState{
    token?: string
    id?: string
    role: string
    expires_at: Date
    isAuthenticated: boolean
}

interface AuthPayload{
    token: string
    id: string
    role: string
    expires_at: Date
}

interface UserLoginAction{
    type: TypeAction.LOGIN
    payload: AuthPayload
}

interface UserLogoutAction{
    type: TypeAction.LOGOUT
}

type UserAuthAction = UserLoginAction | UserLogoutAction

const initState = ():AuthState => {
	let datauser = localStorage.getItem(SMARTHOME_USER_DATA)
	if (!datauser)
		datauser = '{}';
	const data = JSON.parse(datauser)
	let newdata: AuthState = {
		token: data?.token || '',
		id: data?.id || undefined,
		role: data?.role || "",
		isAuthenticated: !!data.token,
		expires_at: (data?.expires_at)?new Date(data?.expires_at):new Date(),
	}
	return newdata
}

export const authReducer = (state:AuthState = initState(), action:UserAuthAction) =>{
	switch (action.type){
		case TypeAction.LOGIN:
			localStorage.setItem(SMARTHOME_USER_DATA, JSON.stringify({
				id: action.payload.id, role:action.payload.role, token:action.payload.token, expires_at: new Date(action.payload.expires_at)
			}))
			return ({token: action.payload.token, id: action.payload.id, role: action.payload.role, isAuthenticated:true, expires_at: new Date(action.payload.expires_at)})
		case TypeAction.LOGOUT:
			localStorage.removeItem(SMARTHOME_USER_DATA)
			if(state.token)
				logoutInSession(state.token)
			return ({token: '', id: undefined, role: "", isAuthenticated:false, expires_at: new Date()})
		default:
			return state
	}
}

export const logout = ():UserAuthAction => ({type: TypeAction.LOGOUT})
export const login = (token:string, id:string, role: string, expires_at: Date):UserAuthAction => {
	return{type: TypeAction.LOGIN, payload:{token, id, role: role, expires_at}}
}
