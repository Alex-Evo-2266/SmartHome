import './NavigationBar.scss'
import { Circle, Home, Menu, MoreHorizontal} from 'lucide-react'
import { NavigationbarItem } from './NavigationBarItem'
import { NavButton } from './NavButton'
import { useAppDispatch, useAppSelector } from '../../../../shared/lib/hooks/redux'
import { toggleNavigation } from '../../../../features/Navigation/lib/reducers/NavigationReducer'

export const NavigationBar = () => {

	const dispatch = useAppDispatch()
	const navigation = useAppSelector(state=>state.navigation)

	return(
		<div className={`navigation-bar-container`}>
			<div className='block-content'>
				<NavButton icon={<Menu/>} onClick={()=>dispatch(toggleNavigation())} title='menu'/>
				<NavigationbarItem icon={<Home/>} to='/home' title='home'/>
				<NavigationbarItem icon={<Circle/>} to='/room' title='room'/>
				{
					(navigation.btn)?
					<>
						<NavButton icon={navigation.btn.icon ?? <MoreHorizontal/>} onClick={navigation.btn.onClick} title={navigation.btn.text}/>
					</>:
					null
				}
			</div>
		</div>
	)
}