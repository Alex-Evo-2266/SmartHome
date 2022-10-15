import { HIDE_DIALOG, SHOW_DIALOG } from "../types"

const initState = {
	visible: false,
	type: "",
	title: "",
	placeholder: "",
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
export const hide = () => ({type: HIDE_DIALOG})