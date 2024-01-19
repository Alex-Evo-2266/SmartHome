import { NavItem } from "../.."
import { IMenuItem } from "../../../../shared/model/menu"

enum NavigationActionType{
    SHOW_NAVIGATION = "SHOW_NAVIGATION",
    HIDE_NAVIGATION = "HIDE_NAVIGATION",
    TOGGLE_NAVIGATION = "TOGGLE_NAVIGATION",
    SET_ITEMS_NAVIGATION = "SET_ITEMS_NAVIGATION",
    SET_SEARCH = "SET_SEARCH",
    SET_MENU = "SET_MENU"
}

interface PayloadNavigation{
    items?: NavItem[]
    favouritesItems?: NavItem[] 
}

interface INavigationState{
    visible: boolean
    items: NavItem[]
    favouritesItems: NavItem[]
    search?: (data:string)=>void
    menu?: IMenuItem[]
}

interface NavigationSetItemsAction{
    type: NavigationActionType.SET_ITEMS_NAVIGATION
    payload: PayloadNavigation
}

interface NavigationSetSearchAction{
    type: NavigationActionType.SET_SEARCH
    payload?: (data:string)=>void
}

interface NavigationSetMenuAction{
    type: NavigationActionType.SET_MENU
    payload?: IMenuItem[]
}

interface NavigationToggleAction{
    type: NavigationActionType.SHOW_NAVIGATION | NavigationActionType.HIDE_NAVIGATION | NavigationActionType.TOGGLE_NAVIGATION
}

type NavigationAction = NavigationToggleAction | NavigationSetItemsAction | NavigationSetMenuAction | NavigationSetSearchAction

const initState: INavigationState = {
    visible: false,
    items: [],
    favouritesItems: [],
    search: undefined,
    menu:undefined
}

export const navigationReducer = (state:INavigationState = initState, action:NavigationAction) => {
    switch (action.type){
        case NavigationActionType.SHOW_NAVIGATION:
            return {...state, visible: true}
        case NavigationActionType.HIDE_NAVIGATION:
            return {...state, visible: false}
        case NavigationActionType.TOGGLE_NAVIGATION:
            return {...state, visible: !state.visible}
        case NavigationActionType.SET_ITEMS_NAVIGATION:
            return {...state, ...action.payload}
        case NavigationActionType.SET_SEARCH:
            return {...state, search: action.payload}
        case NavigationActionType.SET_MENU:
            return {...state, menu: action.payload}
        default:
            return state
    }
}

export const showNavigation = ():NavigationAction => ({type: NavigationActionType.SHOW_NAVIGATION})
export const hideNavigation = ():NavigationAction => ({type: NavigationActionType.HIDE_NAVIGATION})
export const toggleNavigation = ():NavigationAction => ({type: NavigationActionType.TOGGLE_NAVIGATION})
export const setNavigation = (payload: PayloadNavigation):NavigationAction => ({type: NavigationActionType.SET_ITEMS_NAVIGATION, payload})
export const setSearch = (payload: (data:string)=>void | undefined):NavigationAction => ({type: NavigationActionType.SET_SEARCH, payload})
export const setMenu = (payload: IMenuItem[] | undefined):NavigationAction => ({type: NavigationActionType.SET_MENU, payload})


// import { NavItem } from "../.."
// import { IMenuItem } from "../../../../shared/model/menu"

// enum NavigationActionType{
//     SHOW_NAVIGATION = "SHOW_NAVIGATION",
//     HIDE_NAVIGATION = "HIDE_NAVIGATION",
//     TOGGLE_NAVIGATION = "TOGGLE_NAVIGATION",
//     SET_ITEMS_NAVIGATION = "SET_ITEMS_NAVIGATION",
//     SET_SEARCH = "SET_SEARCH",
//     SET_MENU = "SET_MENU",
// }

// interface PayloadNavigation{
//     items?: NavItem[]
//     favouritesItems?: NavItem[] 
// }

// interface PayloadSearchNavigation{
//     search: (data:string)=>void
// }

// interface PayloadMenuNavigation{
//     menu: (data:string)=>void
// }

// interface INavigationState{
//     visible: boolean
//     items: NavItem[]
//     favouritesItems: NavItem[]
//     search: (data:string)=>void
//     menu: IMenuItem[]
// }

// interface NavigationSetItemsAction{
//     type: NavigationActionType.SET_ITEMS_NAVIGATION
//     payload: PayloadNavigation
// }

// interface NavigationSetSearchAction{
//     type: NavigationActionType.SET_SEARCH
//     payload: PayloadSearchNavigation
// }

// interface NavigationSetMenuAction{
//     type: NavigationActionType.SET_MENU
//     payload: PayloadMenuNavigation
// }

// interface NavigationToggleAction{
//     type: NavigationActionType.SHOW_NAVIGATION | NavigationActionType.HIDE_NAVIGATION | NavigationActionType.TOGGLE_NAVIGATION
// }

// type NavigationAction = NavigationToggleAction | NavigationSetItemsAction | NavigationSetSearchAction | NavigationSetMenuAction

// const initState: INavigationState = {
//     visible: false,
//     items: [],
//     favouritesItems: [],
//     search: ()=>{},
//     menu:[]
// }

// export const navigationReducer = (state:INavigationState = initState, action:NavigationAction) => {
//     switch (action.type){
//         case NavigationActionType.SHOW_NAVIGATION:
//             return {...state, visible: true}
//         case NavigationActionType.HIDE_NAVIGATION:
//             return {...state, visible: false}
//         case NavigationActionType.TOGGLE_NAVIGATION:
//             return {...state, visible: !state.visible}
//         case NavigationActionType.SET_ITEMS_NAVIGATION:
//             return {...state, ...action.payload}
//         case NavigationActionType.SET_SEARCH:
//             return {...state, ...action.payload}
//         case NavigationActionType.SET_MENU:
//             return {...state, ...action.payload}
//         default:
//             return state
//     }
// }

// export const showNavigation = ():NavigationAction => ({type: NavigationActionType.SHOW_NAVIGATION})
// export const hideNavigation = ():NavigationAction => ({type: NavigationActionType.HIDE_NAVIGATION})
// export const toggleNavigation = ():NavigationAction => ({type: NavigationActionType.TOGGLE_NAVIGATION})
// export const setNavigation = (payload: PayloadNavigation):NavigationAction => ({type: NavigationActionType.SET_ITEMS_NAVIGATION, payload})
// export const setSearch = (payload: PayloadSearchNavigation):NavigationAction => ({type: NavigationActionType.SET_SEARCH, payload})
// export const setMenu = (payload: PayloadMenuNavigation):NavigationAction => ({type: NavigationActionType.SET_MENU, payload})