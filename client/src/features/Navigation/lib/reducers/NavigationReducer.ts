import { NavItem } from "../.."

enum NavigationActionType{
    SHOW_NAVIGATION = "SHOW_NAVIGATION",
    HIDE_NAVIGATION = "HIDE_NAVIGATION",
    SET_ITEMS_NAVIGATION = "SET_ITEMS_NAVIGATION",
}

interface PayloadNavigation{
    items?: NavItem[]
    favouritesItems?: NavItem[] 
}

interface INavigationState{
    visible: boolean
    items: NavItem[]
    favouritesItems: NavItem[]
}

interface NavigationSetItemsAction{
    type: NavigationActionType.SET_ITEMS_NAVIGATION
    payload: PayloadNavigation
}

interface NavigationShowAction{
    type: NavigationActionType.SHOW_NAVIGATION
}

interface NavigationHideAction{
    type: NavigationActionType.HIDE_NAVIGATION
}

type NavigationAction = NavigationShowAction | NavigationHideAction | NavigationSetItemsAction

const initState: INavigationState = {
    visible: false,
    items: [],
    favouritesItems: []
}

export const navigationReducer = (state:INavigationState = initState, action:NavigationAction) => {
    switch (action.type){
        case NavigationActionType.SHOW_NAVIGATION:
            return {...state, visible: true}
        case NavigationActionType.HIDE_NAVIGATION:
            return {...state, visible: false}
        case NavigationActionType.SET_ITEMS_NAVIGATION:
            return {...state, ...action.payload}
        default:
            return state
    }
}

export const showNavigation = ():NavigationAction => ({type: NavigationActionType.SHOW_NAVIGATION})
export const hideNavigation = ():NavigationAction => ({type: NavigationActionType.HIDE_NAVIGATION})
export const setNavigation = (payload: PayloadNavigation):NavigationAction => ({type: NavigationActionType.SET_ITEMS_NAVIGATION, payload})