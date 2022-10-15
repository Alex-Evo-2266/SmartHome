import { HIDE_MENU, SET_MENU_FIELD, SHOW_MENU, TOGLE_MENU} from "../types"

const initState = {
	visible: false,
	fields:[]
}

export const menuReducer = (state = initState, action) =>{
	switch (action.type){
		case SHOW_MENU:
			return ({...state, visible: true})
		case HIDE_MENU:
			return ({...state, visible: false})
		case TOGLE_MENU:
			return ({...state, visible: !state.visible})
		case SET_MENU_FIELD:
			return ({...state, fields: action.payload.fields})
		default:
			return state
	}
}

export const show_menu = () => ({type: SHOW_MENU})
export const hide_menu = () => ({type: HIDE_MENU})