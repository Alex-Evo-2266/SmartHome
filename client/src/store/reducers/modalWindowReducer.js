import { HIDE_MODAL_WINDOW, SHOW_MODAL_WINDOW } from "../types"

const initState = {
	visible: false,
	type: "",
	title: "",
	html: null,
	buttons: [],
	options: {}
}

export const ModalWindowReducer = (state = initState, action) =>{
	switch (action.type){
		case SHOW_MODAL_WINDOW:
			return ({...action.payload, visible: true})
		case HIDE_MODAL_WINDOW:
			return ({...state, visible: false})
		default:
			return state
	}
}

export const showCastomWindow = (title, html, buttons = [], options = {}) => ({type: SHOW_MODAL_WINDOW, payload:{
	type: "html",
	title,
	html,
	buttons,
	options
}})
export const hide = () => ({type: HIDE_MODAL_WINDOW})
export const hideWindow = () => ({type: HIDE_MODAL_WINDOW})