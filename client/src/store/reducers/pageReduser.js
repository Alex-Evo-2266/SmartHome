import { SET_PAGE } from "../types"

const initState = {
	page: {}
}

// export const load_page_action = (token) =>{
// 	return (dispatch)=>{
// 		let headers = {}
// 		headers['Authorization-Token'] = `Bearer ${token}`
// 		headers['Content-Type'] = 'application/json'
// 		fetch(`/api/page/all`, {method: "GET", headers})
// 			.then(response => response.json())
// 			.then(json => dispatch({type: LOAD_PAGE, payload: json}))
// 	}
// }

export const pageReducer = (state = initState, action) =>{
	switch (action.type){
		case SET_PAGE:
			return ({...state, page:action.payload.page})
		default:
			return state
	}
}