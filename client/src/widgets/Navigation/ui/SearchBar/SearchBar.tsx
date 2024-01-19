import './SearchBar.scss'
import { MoreVertical } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../../shared/lib/hooks/redux'
import { IconButton, Search } from '../../../../shared/ui'
import { useCallback } from 'react'
import { showBaseMenu } from '../../../../shared/lib/reducers/menuReducer'

export const SearchBar = () => {

	const dispatch = useAppDispatch()
	const navigayion = useAppSelector(state=>state.navigation)

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		if (navigayion.menu)
			dispatch(showBaseMenu(navigayion.menu, event.pageX, event.pageY, {autoHide: true}))
	},[dispatch])

	const onSearch = useCallback((data:string)=>{
		if (navigayion.search)
            navigayion.search && navigayion.search(data)
	},[navigayion.search])

	return(
		<div className={`navigation-search-bar-container`}>
			{
				(navigayion.search)?
				<Search placeholder='device name' onSearch={onSearch}/>
				:null
			}
			{
				(navigayion.menu)?
				<IconButton className='btn-block-menu' icon={<MoreVertical/>} onClick={onMenu}/>
				:null
			}
		</div>
	)
}