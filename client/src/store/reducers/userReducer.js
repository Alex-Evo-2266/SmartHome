import { SET_USER } from "../types"

const initState = {
	name: "",
	email: "",
	id: null,
}

export const UserReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_USER:
			return ({...state, ...action.payload})
		default:
			return state
	}
}