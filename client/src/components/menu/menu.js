import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showTextDialog } from '../../store/reducers/dialogReducer'
import { togle_menu } from '../../store/reducers/menuReducer'
import { HIDE_MENU } from '../../store/types'
import { LeftMenu } from './leftMenu'
import { TopMenu } from './topMenu'


export const Menu = () =>{
	
	const dispatch = useDispatch()
	const menu = useSelector(state => state.menu)
	const [insluedField, setInsluedField] = useState([])
	const [otherField, setOtherField] = useState([])

	const sortMenuField = useCallback(()=>{
		console.log(menu)
		let arr1 = menu?.fields?.slice()
		let arr2 = []
		for (let item of menu.insluedField)
		{
			arr1 = arr1.filter((item2)=>item2.title!==item.title)
			arr2.push(item)
		}
		setInsluedField(arr2)
		setOtherField(arr1)
	},[menu])

	const get_search = useCallback(()=>{
		if (typeof(menu.search) === "function")
			return ()=>{
				dispatch(showTextDialog("Search", "", "name", menu.search))
			}
		return null
	},[dispatch, menu.search])

	useEffect(()=>{
		sortMenuField()
	},[sortMenuField])

	useEffect(()=>{
		console.log(menu.search)
	},[menu.search])

	return(
		<>
			<TopMenu buttons={menu.tabs} dopmenuBtn={menu.dopmenu} togle={()=>dispatch(togle_menu())} title={menu.title} searchTogle={get_search()}/>
			<LeftMenu visible={menu.visible} hide={()=>dispatch({type:HIDE_MENU})} insluedField={insluedField} otherField={otherField}/>
		</>
	)
}