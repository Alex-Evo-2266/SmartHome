import { combineReducers } from "redux";
import dialogReducer from "../../shared/lib/reducers/baseDialogReducer";


export const rootReducer = combineReducers({
    dialog: dialogReducer
})