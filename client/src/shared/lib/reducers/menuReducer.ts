import { IBlock, IMenuItem } from "../../model/menu"

export enum MenuActionType{
    SHOW_MENU = "SHOW_MENU",
    HIDE_MENU = "HIDE_MENU"
}

interface PayloadMenu{
    blocks: IBlock[]
    x: number
    y: number
}

interface IMenuState{
    blocks: IBlock[]
    visible: boolean
    x: number
    y: number
}

interface MenuShowAction{
    type: MenuActionType.SHOW_MENU
    payload: PayloadMenu
}

interface MenuHideAction{
    type: MenuActionType.HIDE_MENU
}

type MenuAction = MenuShowAction | MenuHideAction

const initState: IMenuState = {
    blocks: [],
    visible: false,
    x: 0,
    y: 0
}

const menuReducer = (state:IMenuState = initState, action:MenuAction) => {
    switch (action.type){
        case MenuActionType.SHOW_MENU:
            return {...state, blocks: action.payload.blocks, visible: true, x: action.payload.x, y: action.payload.y}
        case MenuActionType.HIDE_MENU:
            return {...state, ...initState}
        default:
            return state
    }
}

export const showMenu = (blocks: IBlock[], x:number, y:number):MenuAction => ({type: MenuActionType.SHOW_MENU, payload:{x, y, blocks}})
export const showBaseMenu = (items: IMenuItem[], x:number, y:number):MenuAction => ({type: MenuActionType.SHOW_MENU, payload:{x, y, blocks:[{items}]}})
export const hideMenu = ():MenuAction => ({type: MenuActionType.HIDE_MENU})
export default menuReducer