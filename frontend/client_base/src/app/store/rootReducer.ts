import { combineReducers } from "redux";

import {deviceReducer} from "../../entites/devices/index"
import menuReducer from "../../shared/lib/reducers/menuReducer";
import snackbarReducer from "../../shared/lib/reducers/snackbarReducer";
import { authReducer } from "../../shared/lib/reducers/userAuthDataReducer";


export const rootReducer = combineReducers({
    menu: menuReducer,
    snackbar: snackbarReducer,
    auth: authReducer,
    devices: deviceReducer,
})