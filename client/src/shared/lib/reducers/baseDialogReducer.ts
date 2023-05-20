export enum DialogActionType{
    ADD_DIALOG = "ADD_DIALOG",
    DELETE_DIALOG = "DELETE_DIALOG"
}

export enum DialogType{
    BASE_DIALOG = "BASE_DIALOG",
    FULL_SCREEN_DIALOG = "FULL_SCREEN_DIALOG"
}

interface IDialogState{
    baseDialog: React.ReactNode[]
    fullScreenDialog: React.ReactNode[]
}

interface PayloadDialog{
    dialog: React.ReactNode
    type: DialogType
}

interface DialogAddAction{
    type: DialogActionType.ADD_DIALOG
    payload: PayloadDialog
}

interface DialogDeleteAction{
    type: DialogActionType.DELETE_DIALOG
    payload: DialogType
}

type DialogAction = DialogAddAction | DialogDeleteAction

const initState: IDialogState = {
    baseDialog: [],
    fullScreenDialog: []
}

const dialogReducer = (state:IDialogState = initState, action:DialogAction) => {
    switch (action.type){
        case DialogActionType.ADD_DIALOG:
            if(action.payload.type === DialogType.BASE_DIALOG)
            {
                let newArr = state.baseDialog.slice()
                newArr.push(action.payload.dialog)
                return {...state, baseDialog: newArr}
            }
            else
            {
                let newArr = state.fullScreenDialog.slice()
                newArr.push(action.payload.dialog)
                return {...state, fullScreenDialog: newArr}
            }
        case DialogActionType.DELETE_DIALOG:
            if(action.payload === DialogType.BASE_DIALOG)
            {
                let newArr = state.baseDialog.slice()
                newArr.pop()
                return {...state, baseDialog: newArr}
            }
            else
            {
                let newArr = state.fullScreenDialog.slice()
                newArr.pop()
                return {...state, fullScreenDialog: newArr}
            }
        default:
            return state
    }
}

export const showDialog = (payload: PayloadDialog):DialogAction => ({type: DialogActionType.ADD_DIALOG, payload})
export const hideDialog = (payload: DialogType):DialogAction => ({type: DialogActionType.DELETE_DIALOG, payload})
export default dialogReducer