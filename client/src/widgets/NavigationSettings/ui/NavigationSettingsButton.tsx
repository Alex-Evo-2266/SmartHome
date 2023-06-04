import { useCallback } from "react"
import { Button } from "../../../shared/ui"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSaveNavigationItems } from "../api/saveNavigationItems"


export const NavigationSettingsButtons = ()=>{

    const navigation = useAppSelector(state=>state.navigation)
	const {saveFavouriteItems} = useSaveNavigationItems()

    const save = useCallback(async()=>{
		saveFavouriteItems(navigation.favouritesItems)
	},[navigation.favouritesItems])

    return(
        <div className="settings-navigation-button">
            <Button onClick={save}>save</Button>
        </div>
    )
} 