import { UserData } from "../../model/user";

enum TypeAction{
    SET_DATA = "SET_DATA"
}

type UserState = UserData

interface UserSetAction{
    type: TypeAction.SET_DATA
    payload: UserData
}

type UserAuthAction = UserSetAction

const initState:UserState = {}

export const userReducer = (state:UserState = initState, action:UserAuthAction) =>{
	switch (action.type){
		case TypeAction.SET_DATA:
			return ({...action.payload})
		default:
			return state
	}
}

export const setUserData = (payload: UserData):UserAuthAction => ({type: TypeAction.SET_DATA, payload})