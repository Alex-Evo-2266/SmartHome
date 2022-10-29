import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { setTabs, setTitle } from '../../store/reducers/menuReducer'
import { SettingsMenuPage } from './SettingsMenu'
import { SettingsServerPage } from './SettingsServer'

export const SettingsPage = () => {

  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [page, setPage] = useState("menu")

  const getTabs = useCallback(()=>{
	let tabs = [
		{
			title:"settings menu",
			onClick:()=>setPage("menu"),
			active:(page==="menu")
		}
	]
	if (auth.role === "admin")
		tabs.push({
			title:"settings server",
			onClick:()=>setPage("server"),
			active:(page==="server")
		})
	return tabs
  },[page, auth.role])

  useEffect(()=>{
    dispatch(setTitle("Settings"))
  },[dispatch])

  useEffect(()=>{
	setTimeout(() => dispatch(setTabs(getTabs())), 0);
  },[dispatch, getTabs])

	if(page === "menu")
		return(
			<div className='conteiner'>
				<SettingsMenuPage/>
			</div>
	  	)

	if(page === "server" && auth.role === "admin")
		return (
			<SettingsServerPage/>
		)
	setPage("menu")
	return null
}
