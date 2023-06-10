import { combineReducers } from "redux";
import dialogReducer from "../../shared/lib/reducers/dialogReducer";
import bottomSheetsReducer from "../../shared/lib/reducers/bottomSheetsReducer";
import menuReducer from "../../shared/lib/reducers/menuReducer";
import snackbarReducer from "../../shared/lib/reducers/snackbarReducer";
import { authReducer, userReducer } from "../../entites/User";
import { navigationReducer } from "../../features/Navigation";


export const rootReducer = combineReducers({
    dialog: dialogReducer,
    bottomSheets: bottomSheetsReducer,
    menu: menuReducer,
    snackbar: snackbarReducer,
    auth: authReducer,
    navigation: navigationReducer,
    user: userReducer
})