import { NavItem } from "../.."
import { NavigationButton } from "../../models/navigationItem"

enum NavigationActionType{
    SHOW_NAVIGATION = "SHOW_NAVIGATION",
    HIDE_NAVIGATION = "HIDE_NAVIGATION",
    TOGGLE_NAVIGATION = "TOGGLE_NAVIGATION",
    SET_ITEMS_NAVIGATION = "SET_ITEMS_NAVIGATION",
    SET_BUTTON = "SET_BUTTON",
}

interface PayloadNavigation{
    items?: NavItem[]
    favouritesItems?: NavItem[] 
}

interface INavigationState{
    visible: boolean
    items: NavItem[]
    favouritesItems: NavItem[]
    btn?: NavigationButton
}

interface NavigationSetItemsAction{
    type: NavigationActionType.SET_ITEMS_NAVIGATION
    payload: PayloadNavigation
}

interface NavigationSetButtonAction{
    type: NavigationActionType.SET_BUTTON
    payload: NavigationButton
}

interface NavigationToggleAction{
    type: NavigationActionType.SHOW_NAVIGATION | NavigationActionType.HIDE_NAVIGATION | NavigationActionType.TOGGLE_NAVIGATION
}

type NavigationAction = NavigationToggleAction | NavigationSetItemsAction | NavigationSetButtonAction

const initState: INavigationState = {
    visible: false,
    items: [],
    favouritesItems: [],
    btn: undefined
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
        case NavigationActionType.SET_BUTTON:
            return {...state, btn:action.payload}
        default:
            return state
    }
}

export const showNavigation = ():NavigationAction => ({type: NavigationActionType.SHOW_NAVIGATION})
export const hideNavigation = ():NavigationAction => ({type: NavigationActionType.HIDE_NAVIGATION})
export const toggleNavigation = ():NavigationAction => ({type: NavigationActionType.TOGGLE_NAVIGATION})
export const setNavigation = (payload: PayloadNavigation):NavigationAction => ({type: NavigationActionType.SET_ITEMS_NAVIGATION, payload})
export const setNavigationButton = (payload: NavigationButton):NavigationAction => ({type: NavigationActionType.SET_BUTTON, payload})