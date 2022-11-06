import { HIDE_DIALOG, SHOW_DIALOG } from "../types"

const initState = {
	visible: false,
	type: "",
	title: "",
	placeholder: "",
	text: "",
	buttons: [],
	active: ()=>{},
	items: []
}

export const DialogReducer = (state = initState, action) =>{
	switch (action.type){
		case SHOW_DIALOG:
			return ({...action.payload, visible: true})
		case HIDE_DIALOG:
			return ({...state, visible: false})
		default:
			return state
	}
}

export const show = (payload) => ({type: SHOW_DIALOG, payload})
export const showAlertDialog = (title, text="", buttons=[]) => ({type: SHOW_DIALOG, payload:{
	type: "alert",
	title,
	text,
	buttons
}})
export const showTextDialog = (title, text="", placeholder, active) => ({type: SHOW_DIALOG, payload:{
	type: "text",
	title,
	text,
	placeholder,
	active
}})
export const showConfirmationDialog = (title, items, active) => ({type: SHOW_DIALOG, payload:{
	type: "confirmation",
	title,
	items,
	active
}})
export const showCastomDialog = (title, html, buttons = []) => ({type: SHOW_DIALOG, payload:{
	type: "html",
	title,
	html,
	buttons
}})
export const hide = () => ({type: HIDE_DIALOG})
export const hideDialog = () => ({type: HIDE_DIALOG})