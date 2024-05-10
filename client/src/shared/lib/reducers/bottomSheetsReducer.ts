export enum BottomSheetsActionType{
    SHOW_BOTTOM_SHEETS = "SHOW_BOTTOM_SHEETS",
    HIDE_BOTTOM_SHEETS = "HIDE_BOTTOM_SHEETS"
}

interface IBottomSheetsState{
    children: React.ReactNode
    visible: boolean
    onHide?: ()=>void
}

interface PayloadBottomSheets{
    children: React.ReactNode
    onHide?: ()=>void
}

export interface BottomSheetsShowAction{
    type: BottomSheetsActionType.SHOW_BOTTOM_SHEETS
    payload: PayloadBottomSheets
}

export interface BottomSheetsHideAction{
    type: BottomSheetsActionType.HIDE_BOTTOM_SHEETS
}

export type BottomSheetsAction = BottomSheetsShowAction | BottomSheetsHideAction

const initState: IBottomSheetsState = {
    children: [],
    visible: false
}

const bottomSheetsReducer = (state:IBottomSheetsState = initState, action:BottomSheetsAction) => {
    switch (action.type){
        case BottomSheetsActionType.SHOW_BOTTOM_SHEETS:
            return {...state, children: action.payload.children, visible: true, onHide: action.payload.onHide}
        case BottomSheetsActionType.HIDE_BOTTOM_SHEETS:
            return initState

        default:
            return state
    }
}

export const showBottomSheets = (children: React.ReactNode, onHide?:()=>void):BottomSheetsAction => ({type: BottomSheetsActionType.SHOW_BOTTOM_SHEETS, payload:{children, onHide}})
export const hideBottomSheets = ():BottomSheetsAction => ({type: BottomSheetsActionType.HIDE_BOTTOM_SHEETS})
export default bottomSheetsReducer