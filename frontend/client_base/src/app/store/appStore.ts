import { createStore } from "redux";
import { rootReducer } from "./rootReducer";

export const store = createStore(rootReducer)


export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch