import { MeData } from "@src/entites/auth/models/me";
import { logoutInSession } from "../../api/logout";

const SMARTHOME_USER_DATA = 'smarthome_user_data';

enum TypeAction{
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
	INIT = "INIT_AUTH",
}

interface InitAuthAction {
  type: TypeAction.INIT
}

interface AuthState{
    user_data?: MeData
    expires_at?: Date
    isAuthenticated: boolean
	isInitialized: boolean
}

interface AuthPayload{
    user_data: MeData
    expires_at?: Date
}

interface UserLoginAction{
    type: TypeAction.LOGIN
    payload: AuthPayload
}

interface UserLogoutAction{
    type: TypeAction.LOGOUT
}

type UserAuthAction = UserLoginAction | UserLogoutAction | InitAuthAction

const initState = (): AuthState => {
  const raw = localStorage.getItem(SMARTHOME_USER_DATA)
  if (!raw) {
    return {
      user_data: undefined,
      isAuthenticated: false,
      isInitialized: false,
    }
  }

  const data = JSON.parse(raw)

  return {
    user_data: data.user_data,
    isAuthenticated: !!data.user_data,
    isInitialized: false,
  }
}

export const authReducer = (state:AuthState = initState(), action:UserAuthAction) =>{
	switch (action.type){
		case TypeAction.LOGIN:
			if(!action.payload.user_data)
			{
				return state
			}
			localStorage.setItem(SMARTHOME_USER_DATA, JSON.stringify({
				user_data: action.payload.user_data, expires_at: action.payload.expires_at && new Date(action.payload.expires_at)
			}))
			return ({...state, user_data: action.payload.user_data, isAuthenticated:true, expires_at: action.payload.expires_at && new Date(action.payload.expires_at)})
		case TypeAction.LOGOUT:
			localStorage.removeItem(SMARTHOME_USER_DATA)
			logoutInSession()
			return ({...state, user_data: undefined, isAuthenticated:false, expires_at: new Date()})
		case TypeAction.INIT:
			return {
				...state,
				isInitialized: true,
			}
		default:
			return state
	}
}

export const logout = ():UserAuthAction => ({type: TypeAction.LOGOUT})
export const login = (user:MeData, expires_at?: Date):UserAuthAction => {
	return{type: TypeAction.LOGIN, payload:{user_data:user, expires_at}}
}
export const initAuth = (): InitAuthAction => ({type:TypeAction.INIT})
