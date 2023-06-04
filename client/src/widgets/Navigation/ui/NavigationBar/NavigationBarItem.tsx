import { NavLink } from "react-router-dom"

interface NavigationbarItemProps{
	title?: string
	icon: React.ReactNode
	to: string
}

export const NavigationbarItem = ({icon, title, to}:NavigationbarItemProps) => {

	return(
		<NavLink to={to} className='navigation-item'>
			<div className='navigation-item-icon'>{icon}</div>
			<div className='navigation-item-text'>{title}</div>
		</NavLink>
	)
}