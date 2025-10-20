
export enum SnackbarActionType{
    SHOW_SNACKBAR = "SHOW_SNACKBAR",
    HIDE_SNACKBAR = "HIDE_SNACKBAR"
}

export interface IOptionSnackbar{
    onClick?: ()=>void
    buttonText?: string
    closeButton?: boolean
    backgroundColor?: string,
    color?: string
    className?: string
}

interface PayloadSnackbar{
    option?:IOptionSnackbar
    text: string
}

export interface ISnackbarState{
    option?:IOptionSnackbar
    text: string
    visible: boolean
}

export interface SnackbarShowAction{
    type: SnackbarActionType.SHOW_SNACKBAR
    payload: PayloadSnackbar
}

export interface SnackbarHideAction{
    type: SnackbarActionType.HIDE_SNACKBAR
}

type SnackbarAction = SnackbarShowAction | SnackbarHideAction

const initState: ISnackbarState = {
    text: "",
    visible: false
}

const snackbarReducer = (state:ISnackbarState = initState, action:SnackbarAction) => {
    switch (action.type){
        case SnackbarActionType.SHOW_SNACKBAR:
            return {...state, text: action.payload.text, option:action.payload.option, visible: true}
        case SnackbarActionType.HIDE_SNACKBAR:
            return {...state, ...initState}
        default:
            return state
    }
}

export const showSnackbar = (text: string, option?: IOptionSnackbar):SnackbarAction => ({type: SnackbarActionType.SHOW_SNACKBAR, payload:{text, option}})
export const hideSnackbar = ():SnackbarAction => ({type: SnackbarActionType.HIDE_SNACKBAR})
export default snackbarReducer