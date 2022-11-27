import {applyMiddleware, combineReducers, createStore} from 'redux'
import { authReducer } from './reducers/authReducer'
import { pageReducer } from './reducers/pageReduser'
import { menuReducer } from './reducers/menuReducer'
import thunk from "redux-thunk"
import { TopBarReducer } from './reducers/topBarReducer'
import { UserReducer } from './reducers/userReducer'
import { DialogReducer } from './reducers/dialogReducer'
import { alertReducer } from './reducers/alertReducer'
import { StyleReducer } from './reducers/styleReducer'
import { socketReducer } from './reducers/socketReducer'

export const rootReducer = combineReducers({
	auth: authReducer,
	page: pageReducer,
	menu: menuReducer,
	topBar: TopBarReducer,
	user: UserReducer,
	dialog: DialogReducer,
	alert: alertReducer,
	style: StyleReducer,
	socket: socketReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))
