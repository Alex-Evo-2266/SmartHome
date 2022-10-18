import { SET_STYLE } from "../types"

const initState = {
	nightStyle:{
		title: "defnight",
		color1: "#303030",
		color2: "#505050",
		active: "#1e90ff"
	},
	lightStyle:{
		title: "deflight",
		color1: "#303030",
		color2: "#505050",
		active: "#1e90ff"
	},
	specialStyle:{
		title: "defspec",
		color1: "#303030",
		color2: "#505050",
		active: "#1e90ff"
	},
	backgrounds:[],
	specialStyleFlag: false
}

export const StyleReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_STYLE:
			return ({...state, ...action.payload})
		default:
			return state
	}
}

export const setStyle = (payload) => ({type: SET_STYLE, payload})