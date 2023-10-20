import { DeviceOption } from "../.."


enum TypeAction{
    SET_DEVICE_OPTION = "SET_DEVICE_OPTION"
}

type DeviceOptionState = {
	deviceOption: DeviceOption[]
}

interface UserSetAction{
    type: TypeAction.SET_DEVICE_OPTION
    payload: DeviceOptionState
}

type UserAuthAction = UserSetAction

const initState:DeviceOptionState = {
	deviceOption: []
}

export const deviceOptionReducer = (state:DeviceOptionState = initState, action:UserAuthAction) =>{
	switch (action.type){
		case TypeAction.SET_DEVICE_OPTION:
			return ({...action.payload})
		default:
			return state
	}
}

export const setDeviceOptions = (payload: DeviceOption[]):UserAuthAction => ({type: TypeAction.SET_DEVICE_OPTION, payload:{deviceOption: payload}})