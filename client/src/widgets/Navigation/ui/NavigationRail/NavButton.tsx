
interface NavButtonProps{
    icon: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLDivElement>)=>void
    title?: string
}

export const NavButton = ({onClick, icon, title}:NavButtonProps) => {

    return(
		<div onClick={onClick} className='navigation-item'>
			<div className='navigation-item-icon'>{icon}</div>
			<div className='navigation-item-text'>{title}</div>
		</div>
	)
}