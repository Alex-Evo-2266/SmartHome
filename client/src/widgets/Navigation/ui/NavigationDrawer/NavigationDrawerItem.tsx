import { NavLink } from "react-router-dom"

interface NavigationDrawerItemProps{
	title: string
	icon: React.ReactNode
	to: string
	onClick?: ()=>void
}

export const NavigationDrawerItem = ({onClick, icon, title, to}:NavigationDrawerItemProps) => {

	return(
		<NavLink onClick={onClick} to={to} className='navigation-item'>
			<div className='navigation-item-icon'>{icon}</div>
			<div className='navigation-item-text'>{title}</div>
		</NavLink>
	)
}