import { CLEAR_MENU, HIDE_MENU, SET_DOP_MENU, SET_MENU_ALL_FIELD, SET_MENU_FIELD, SET_MENU_USER_FIELD, SET_SEARCH_FUN, SET_TABS, SET_TITLE, SHOW_MENU, TOGLE_MENU} from "../types"

const initState = {
	visible: false,
	fields:[],
	insluedField: [],
	title: "",
	search: null,
	dopmenu: [],
	tabs: []
}

export const menuReducer = (state = initState, action) =>{
	switch (action.type){
		case SHOW_MENU:
			return ({...state, visible: true})
		case HIDE_MENU:
			return ({...state, visible: false})
		case TOGLE_MENU:
			return ({...state, visible: !state.visible})
		case SET_TITLE:
			return ({...state, title: action?.payload?.title})
		case SET_SEARCH_FUN:
			return ({...state, search: action?.payload?.search})
		case SET_DOP_MENU:
			return ({...state, dopmenu: action?.payload?.dopmenu})
		case SET_TABS:
			return ({...state, tabs: action?.payload?.tabs})
		case SET_MENU_FIELD:
			return ({
				...state, 
				fields: (action?.payload?.fields)?action.payload.fields:[], 
				insluedField: (action?.payload?.insluedField)?action.payload.insluedField:[]
			})
		case SET_MENU_ALL_FIELD:
			return ({
				...state, 
				fields: (action?.payload?.fields)?action.payload.fields:[], 
			})
		case SET_MENU_USER_FIELD:
			return ({
				...state, 
				insluedField: (action?.payload?.insluedField)?action.payload.insluedField:[]
			})
		case CLEAR_MENU:
			return ({...initState, fields:state.fields, insluedField:state.insluedField})
		default:
			return state
	}
}

export const show_menu = () => ({type: SHOW_MENU})
export const clear_menu = () => ({type: CLEAR_MENU})
export const hide_menu = () => ({type: HIDE_MENU})
export const togle_menu = () => ({type: TOGLE_MENU})
export const setTitle = (title) => ({type: SET_TITLE, payload:{title}})
export const setSearch = (fun) => ({type: SET_SEARCH_FUN, payload:{search: fun}})
export const setDopMenu = (dopmenu) => ({type: SET_DOP_MENU, payload:{dopmenu}})
export const setTabs = (tabs) => ({type: SET_TABS, payload:{tabs}})
export const setAllFields = (fields) => ({type: SET_MENU_ALL_FIELD, payload:{fields}})
export const setUserFields = (insluedField) => ({type: SET_MENU_USER_FIELD, payload:{insluedField}})