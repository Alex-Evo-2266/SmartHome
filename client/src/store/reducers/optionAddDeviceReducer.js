import { SET_OPTIONS, SET_TYPES} from "../types"

const initState = {
	options: [],
	types: []
}

export const optionReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_OPTIONS:
            console.log(action)
			return ({...state, options: action?.payload?.options})
		case SET_TYPES:
			return ({...state, types: action?.payload?.types})
		default:
			return state
	}
}

export const setOptions = (options) => ({type: SET_OPTIONS, payload: {options}})
export const setTypes = (types) => ({type: SET_TYPES, payload: {types}})