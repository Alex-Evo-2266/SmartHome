import { combineReducers } from "redux";
import dialogReducer from "../../shared/lib/reducers/dialogReducer";
import bottomSheetsReducer from "../../shared/lib/reducers/bottomSheetsReducer";
import menuReducer from "../../shared/lib/reducers/menuReducer";


export const rootReducer = combineReducers({
    dialog: dialogReducer,
    bottomSheets: bottomSheetsReducer,
    menu: menuReducer
})