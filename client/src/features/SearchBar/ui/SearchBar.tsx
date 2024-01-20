import './SearchBar.scss'
import { MoreVertical } from 'lucide-react'
import { IconButton, Search } from '../../../shared/ui'
import { useCallback, useEffect, useState } from 'react'
import { ScreenSize, useScreenSize } from '../../../entites/ScreenSize'

interface SearchBarProps{
    left?: string
	styte?: React.CSSProperties
	btn?: {
		onClick: (event:React.MouseEvent<HTMLButtonElement>)=>void
		icon?: React.ReactNode
	}
	search?: (data:string)=>void
}

export const SearchBar = ({left, styte, search, btn}:SearchBarProps) => {

	const {screen} = useScreenSize()
	const [left_margin, setLeft] = useState<string>("")

	const onSearch = useCallback((data:string)=>{
		if (search)
            search && search(data)
	},[search])

	useEffect(()=>{
		if(screen == ScreenSize.BIG_SCREEN)
			setLeft("350px")
		else if(screen == ScreenSize.STANDART)
			setLeft("70px")
		else
			setLeft("-10px")
	},[screen])

	return(
		<div className={`navigation-search-bar-container`} style={{...styte, left:left ?? left_margin, width:`calc(100% - ${left ?? left_margin})`}}>
			{
				(search)?
				<Search placeholder='device name' onSearch={onSearch}/>
				:null
			}
			{
				(btn)?
				<IconButton className='btn-block-menu' icon={btn.icon ?? <MoreVertical/>} onClick={btn.onClick}/>
				:null
			}
		</div>
	)
}