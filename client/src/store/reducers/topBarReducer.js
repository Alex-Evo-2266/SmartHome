import { SET_SEARCH_FUN, SET_TITLE} from "../types"

const initState = {
	title: "",
	search: ()=>{}
}

export const TopBarReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_TITLE:
			return ({...state, title: action?.payload?.title})
		case SET_SEARCH_FUN:
			return ({...state, search: action?.payload?.search})
		default:
			return state
	}
}