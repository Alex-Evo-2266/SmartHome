import { Check, Plus } from "lucide-react"
import { IconButton } from "../../../shared/ui"
import { SettingsNavigationItem } from "../models/settingsNavItem"
import { useCallback } from "react"
import { findItem } from "../lib/helpers/findItem"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { setNavigation } from "../../../features/Navigation/lib/reducers/NavigationReducer"

interface NavigationSettingsItemProps{
    item: SettingsNavigationItem
}

export const NavigationSettingsItem = ({item}:NavigationSettingsItemProps) => {

	const navigation = useAppSelector(state=>state.navigation)
    const dispatch = useAppDispatch()

    const addFavouritesItem = useCallback((item: SettingsNavigationItem)=>{
		let addedItem = findItem(navigation.items, item.title, item.url)
		if(!addedItem)
			return
		let newFavouritesItems = navigation.favouritesItems.slice()
		newFavouritesItems.push(addedItem)
		dispatch(setNavigation({favouritesItems:newFavouritesItems}))
	},[navigation.items, navigation.favouritesItems])

	const removeFavouritesItem = useCallback((item: SettingsNavigationItem)=>{
		let newFavouritesItems = navigation.favouritesItems.filter(item2=>item2.title !== item.title && item2.url !== item.url)
		dispatch(setNavigation({favouritesItems:newFavouritesItems}))
	},[navigation.favouritesItems])

    return(
        <tr>
			<td>
				<IconButton
				    onClick={(item.action)?()=>removeFavouritesItem(item):()=>addFavouritesItem(item)} 
					icon={item.action?<Check/>:<Plus/>}
				/>
			</td>
			<td>{item.title}</td>
			<td>{item.url}</td>
			<td className='table-icon'><div className="table-icon-container">{item.icon}</div></td>
		</tr>
    )
}