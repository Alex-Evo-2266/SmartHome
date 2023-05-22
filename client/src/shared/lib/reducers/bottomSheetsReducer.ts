export enum BottomSheetsActionType{
    SHOW_BOTTOM_SHEETS = "SHOW_BOTTOM_SHEETS",
    HIDE_BOTTOM_SHEETS = "HIDE_BOTTOM_SHEETS"
}

interface IBottomSheetsState{
    children: React.ReactNode
    visible: boolean
}

interface PayloadBottomSheets{
    children: React.ReactNode
}

interface BottomSheetsAddAction{
    type: BottomSheetsActionType.SHOW_BOTTOM_SHEETS
    payload: PayloadBottomSheets
}

interface BottomSheetsDeleteAction{
    type: BottomSheetsActionType.HIDE_BOTTOM_SHEETS
}

type BottomSheetsAction = BottomSheetsAddAction | BottomSheetsDeleteAction

const initState: IBottomSheetsState = {
    children: [],
    visible: false
}

const bottomSheetsReducer = (state:IBottomSheetsState = initState, action:BottomSheetsAction) => {
    switch (action.type){
        case BottomSheetsActionType.SHOW_BOTTOM_SHEETS:
            return {...state, children: action.payload.children, visible: true}
        case BottomSheetsActionType.HIDE_BOTTOM_SHEETS:
            return initState

        default:
            return state
    }
}

export const showBottomSheets = (children: React.ReactNode):BottomSheetsAction => ({type: BottomSheetsActionType.SHOW_BOTTOM_SHEETS, payload:{children}})
export const hideBottomSheets = ():BottomSheetsAction => ({type: BottomSheetsActionType.HIDE_BOTTOM_SHEETS})
export default bottomSheetsReducer