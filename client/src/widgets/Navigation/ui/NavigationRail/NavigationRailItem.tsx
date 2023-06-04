import { NavLink } from "react-router-dom"

interface NavigationRailItemProps{
	title: string
	icon: React.ReactNode
	to: string
}

export const NavigationRailItem = ({icon, title, to}:NavigationRailItemProps) => {

	return(
		<NavLink to={to} className='navigation-item'>
			<div className='navigation-item-icon'>{icon}</div>
			<div className='navigation-item-text'>{title}</div>
		</NavLink>
	)
}