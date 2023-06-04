import { NavItem } from "../../../../features/Navigation"

export const findItem = (items: NavItem[], title: string, url: string) => {
    console.log(items, title, url)
    let data = items.filter(item=>item.title === title && item.url === url)
    if (data.length > 0)
        return data[0]
}