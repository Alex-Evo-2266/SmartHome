import { useCallback, useEffect, useState } from "react"
import { useAppDispatch } from "./redux"
import { hideMenu, showBaseMenu } from "../reducers/menuReducer"
import { IMenuItem } from "../../model/menu"

enum State{
    VISIBLE = "VISIBLE",
    NONE = "NONE",
    RELOAD = "RELOAD"
}

interface MenuState{
    x: number,
    y: number,
    state: State,
    items: IMenuItem[]
}

export const useMenu = () => {

    const dispatch = useAppDispatch()
    const [state, setState] = useState<MenuState | undefined>(undefined)

    const init = useCallback((x: number, y: number, items: IMenuItem[])=>{
        setState({x, y, state:State.NONE, items})
    },[])

    const hide = () => {
        setState(prev=>(prev)?{...prev, state:State.NONE}:undefined)
        dispatch(hideMenu())
    }

    const updateItems = useCallback((items: IMenuItem[])=>{
        if(state && (state.state == State.RELOAD || state.state == State.VISIBLE))
            setState(prev=>(prev)?{...prev, items, state:State.RELOAD}:undefined)
    },[state])

    const showMenu = useCallback(()=>{
        if(!state)
            throw new Error("the menu is not initialized")
        dispatch(showBaseMenu(state.items, state.x, state.y, {onHide:hide, onClick:()=>setState(prev=>(prev)?{...prev, state:State.RELOAD}:undefined)}))
    },[state, dispatch])

    const show = useCallback(()=>{
        setState(prev=>(prev)?{...prev, state:State.RELOAD}:undefined)
    },[])

    useEffect(()=>{
        if(state && state.state == State.RELOAD)
        {
            showMenu()
            setState(prev=>(prev)?{...prev, state:State.VISIBLE}:undefined)
        }
    },[showMenu, state])

    return {init, show, hide, updateItems}
}