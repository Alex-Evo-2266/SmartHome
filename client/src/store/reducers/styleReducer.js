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
	special_topic: false
}

export const StyleReducer = (state = initState, action) =>{
	console.log(state)
	switch (action.type){
		case SET_STYLE:
			console.log({...state, ...action.payload})
			return ({...state, ...action.payload})
		default:
			return state
	}
}

export const setStyle = (payload) => ({type: SET_STYLE, payload})