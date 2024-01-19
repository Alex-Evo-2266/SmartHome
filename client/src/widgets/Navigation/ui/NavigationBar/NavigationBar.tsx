import './NavigationBar.scss'
import { Home, Menu, MoreVertical, Search } from 'lucide-react'
import { NavigationbarItem } from './NavigationBarItem'
import { NavButton } from './NavButton'
import { useAppDispatch, useAppSelector } from '../../../../shared/lib/hooks/redux'
import { toggleNavigation } from '../../../../features/Navigation/lib/reducers/NavigationReducer'
import { IconButton } from '../../../../shared/ui'
import { useCallback } from 'react'
import { showBaseMenu } from '../../../../shared/lib/reducers/menuReducer'
import { hideDialog, showDialog } from '../../../../shared/lib/reducers/dialogReducer'
import { TextDialog } from '../../../../shared/ui/Dialog/BaseDialog/TextDialog'

export const NavigationBar = () => {

	const dispatch = useAppDispatch()
	const navigayion = useAppSelector(state=>state.navigation)

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		if (navigayion.menu)
			dispatch(showBaseMenu(navigayion.menu, event.pageX, event.pageY, {autoHide: true}))
	},[dispatch])

	const showSearch = useCallback(()=>{
		if (navigayion.search)
			dispatch(showDialog(<TextDialog header='Devices' onHide={()=>dispatch(hideDialog())} onSuccess={(data)=>{
				navigayion.search && navigayion.search(data)
			}}/>))
	},[dispatch, navigayion.search])

	return(
		<div className={`navigation-bar-container`}>
			<div className='block-content'>
				<NavButton icon={<Menu/>} onClick={()=>dispatch(toggleNavigation())}/>
				<NavigationbarItem icon={<Home/>} to='/home'/>
				<div className='block-menu'>
					{
						(navigayion.search)?
						<IconButton className='btn-block-menu' icon={<Search/>} onClick={showSearch}/>
						:null
					}
					{
						(navigayion.menu)?
						<IconButton className='btn-block-menu' icon={<MoreVertical/>} onClick={onMenu}/>
						:null
					}
				</div>
			</div>
		</div>
	)
}