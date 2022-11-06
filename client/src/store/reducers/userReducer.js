import { SET_USER } from "../types"

const initState = {
	name: "",
	auth_name: null,
	email: "",
	id: null,
	auth_type: "",
	image_url: "",
	host: ""
}
export const UserReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_USER:
			return ({...state, ...action.payload})
		default:
			return state
	}
}

export const setUserAction = (payload) => ({type:SET_USER, payload})