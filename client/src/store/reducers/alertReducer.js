import { ERROR, INFO } from "../../components/alerts/alertTyps"
import { HIDE_ALERT, SHOW_ALERT } from "../types"
import { WARNING } from "../../components/alerts/alertTyps"

const initialSate = {
	type: INFO,
	title: "",
	visible: false,
	text: ""
}

export const alertReducer = (state = initialSate, action) => {
	switch (action.type){
		case SHOW_ALERT:
			return {...state, title: action.payload.title, type: action.payload.type, text: action.payload.text, visible: true}
		case HIDE_ALERT:
			return {...state, visible: false}
		default:
			return state
	}
}

export const showWarningAlert = (title, text)=>({type:SHOW_ALERT, payload:{title, text, type:WARNING}})
export const showErrorAlert = (title, text)=>({type:SHOW_ALERT, payload:{title, text, type:ERROR}})