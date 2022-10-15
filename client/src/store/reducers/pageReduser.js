import { LOAD_PAGE } from "../types"

const SMARTHOME_USER_DATA = 'smarthome_user_data';

const initState = {
	page: {}
}

export const load_page_action = (token) =>{
	return (dispatch)=>{
		let headers = {}
		headers['Authorization-Token'] = `Bearer ${token}`
		headers['Content-Type'] = 'application/json'
		fetch(`/api/page/all`, {method: "GET", headers})
			.then(response => response.json())
			.then(json => dispatch({type: LOAD_PAGE, payload: json}))
	}
}

// const getPages = useCallback(async()=>{
//     const allpages = await request(`/api/page/all`, 'GET', null,{Authorization: `Bearer ${token}`})
//     console.log(allpages);
//     setPages(allpages)
//   },[request, token])

export const pageReducer = (state = initState, action) =>{
	switch (action.type){
		case LOAD_PAGE:
			return ({...state, page:action.payload.page})
		default:
			return state
	}
}