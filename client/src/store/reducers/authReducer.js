import { LOGIN, LOGOUT} from "../types"

const SMARTHOME_USER_DATA = 'smarthome_user_data';

const initState = () => {
	let datauser = localStorage.getItem(SMARTHOME_USER_DATA)
	if (!datauser)
		datauser = '{}';
	const data = JSON.parse(datauser)
	return{
		token: data?.token || '',
		id: data?.id || null,
		role: data?.role || "base",
		isAuthenticated: !!data.token,
		expires_at: (data?.expires_at)?new Date(data?.expires_at):new Date(),
	}
}

export const authReducer = (state = initState(), action) =>{
	switch (action.type){
		case LOGIN:
			localStorage.setItem(SMARTHOME_USER_DATA, JSON.stringify({
				id: action.payload.id, role:action.payload.role, token:action.payload.token, expires_at: new Date(action.payload.expires_at)
			}))
			return ({token: action.payload.token, id: action.payload.id, role: action.payload.role, isAuthenticated:true, expires_at: new Date(action.payload.expires_at)})
		case LOGOUT:
			localStorage.removeItem(SMARTHOME_USER_DATA)
			return ({token: null, id: null, role: null, isAuthenticated:false, expires_at: new Date()})
		default:
			return state
	}
}

export const login = (token, id, role, expires_at) => ({type: LOGIN, payload:{token, id, role, expires_at}})
export const logout = () => ({type: LOGOUT})