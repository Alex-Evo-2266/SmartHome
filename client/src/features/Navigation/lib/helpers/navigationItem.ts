import { NavItem } from "../../../../features/Navigation"

function isFavouritesItems(item:NavItem, favouritesItems:NavItem[]) {
    for(let favouritesItem of favouritesItems)
    {
        if(item.title === favouritesItem.title && item.url === favouritesItem.url)
            return true
    }
    return false
}

function getOtherNavigationItem(items: NavItem[], favouritesItems: NavItem[]) {
    return items.filter(item=>!isFavouritesItems(item, favouritesItems))
}

export {isFavouritesItems, getOtherNavigationItem}
