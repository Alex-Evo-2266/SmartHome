import {SET_DEVICES, SET_MESSAGES} from "../types"


const initState = {
	devices:[],
	messages:[]
}

export const socketReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_DEVICES:
			return ({...state, devices: action.payload.devices})
		case SET_MESSAGES:
			return ({...state, messages: action.payload.messages})
		default:
			return state
	}
}

export const setDevices = (devices) => ({type: SET_DEVICES, payload:{devices}})
export const setMessages = (messages) => ({type: SET_MESSAGES, payload:{messages}})