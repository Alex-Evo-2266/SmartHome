import { combineReducers } from "redux";
import dialogReducer from "../../shared/lib/reducers/dialogReducer";


export const rootReducer = combineReducers({
    dialog: dialogReducer
})