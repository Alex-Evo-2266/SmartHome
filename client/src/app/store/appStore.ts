import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dialog from "../../shared/slices/baseDialogSlice"
import timePicker from "../../shared/slices/timePickerSlice";

const rootReducer = combineReducers({
    dialog,
    timePicker
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}


export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']