import './NavigationBar.scss'
import { Home, Menu, MoreVertical } from 'lucide-react'
import { NavigationbarItem } from './NavigationBarItem'
import { NavButton } from './NavButton'
import { useAppDispatch } from '../../../../shared/lib/hooks/redux'
import { toggleNavigation } from '../../../../features/Navigation/lib/reducers/NavigationReducer'

export const NavigationBar = () => {

	const dispatch = useAppDispatch()

	return(
		<div className={`navigation-bar-container`}>
			<div className='block-content'>
				<NavButton icon={<Menu/>} onClick={()=>dispatch(toggleNavigation())}/>
				<NavigationbarItem icon={<Home/>} to='/home'/>
				<NavButton icon={<MoreVertical/>} onClick={()=>{}}/>
			</div>
		</div>
	)
}