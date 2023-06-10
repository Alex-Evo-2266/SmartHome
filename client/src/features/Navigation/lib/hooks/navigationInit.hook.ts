import { useCallback } from "react"
import { useAppDispatch } from "../../../../shared/lib/hooks/redux"
import { setNavigation } from "../reducers/NavigationReducer"
import { useNavigationAPI } from "../../api/navigationAPI"


export const NavigationInit = () => {

    const {getAllNavigationItem, getUserNavigationItem} = useNavigationAPI()
    const dispatch = useAppDispatch()

    const init = useCallback(async() => {
        const allItems = await getAllNavigationItem()
        const items = await getUserNavigationItem()
        dispatch(setNavigation({
            items: allItems ?? [],
            favouritesItems: items ?? []
        }))
    },[getAllNavigationItem, getUserNavigationItem])

    return { init }
}