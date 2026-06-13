import { combineReducers } from "redux";

import {deviceReducer} from "../../entites/devices/index"
import menuReducer from "../../shared/lib/reducers/menuReducer";
import snackbarReducer from "../../shared/lib/reducers/snackbarReducer";


export const rootReducer = combineReducers({
    menu: menuReducer,
    snackbar: snackbarReducer,
    devices: deviceReducer,
})