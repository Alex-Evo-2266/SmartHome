import { combineReducers } from "redux";
import dialogReducer from "../../shared/lib/reducers/dialogReducer";
import bottomSheetsReducer from "../../shared/lib/reducers/bottomSheetsReducer";


export const rootReducer = combineReducers({
    dialog: dialogReducer,
    bottomSheets: bottomSheetsReducer
})