import { HIDE_MENU, SET_DOP_MENU, SET_MENU_FIELD, SET_SEARCH_FUN, SET_TABS, SET_TITLE, SHOW_MENU, TOGLE_MENU} from "../types"

const initState = {
	visible: false,
	fields:[],
	insluedField: [],
	title: "",
	search: ()=>{},
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
		default:
			return state
	}
}

export const show_menu = () => ({type: SHOW_MENU})
export const hide_menu = () => ({type: HIDE_MENU})
export const togle_menu = () => ({type: TOGLE_MENU})
export const setTitle = (title) => ({type: SET_TITLE, payload:{title}})
export const setSearch = (fun) => ({type: SET_SEARCH_FUN, payload:{search: fun}})
export const setDopMenu = (dopmenu) => ({type: SET_DOP_MENU, payload:{dopmenu}})
export const setTabs = (tabs) => ({type: SET_TABS, payload:{tabs}})