import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom'
import { AdaptivGrid, AdaptivGridItem } from '../../components/adaptivGrid'
import { useSocket } from '../../hooks/socket.hook'
import { clear_menu, setDopMenu, setSearch, setTitle } from '../../store/reducers/menuReducer'
import { DeviceCard } from './deviceCard/deviceCard'


export const DevicePage = () => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const {devices} = useSelector(state=>state.socket)
  const [sortDevices, setDevices] = useState([])
  const [search, setSearch2] = useState("")

  const serchFilter = useCallback(()=>{
	if(search===""){
		setDevices(devices)
	  return
	}
	let array = devices?.filter(item => (item.name.toLowerCase().indexOf(search.toLowerCase())!==-1))
	setDevices(array)
  },[devices, search])

  const searchout = useCallback((search)=>{
	setSearch2(search)
  },[])

useEffect(()=>{
	dispatch(setTitle("Devices"))
	dispatch(setSearch(searchout))
	return ()=>dispatch(clear_menu())
  },[dispatch, searchout])

  useEffect(()=>{
	serchFilter()
  },[serchFilter])

  return(
	<div className='container'>
		<AdaptivGrid itemClass='.card-container'>
		{
		sortDevices.map((item,index)=>(
			<AdaptivGridItem key={index}>
				<DeviceCard device={item} systemName={item.system_name}/>
			</AdaptivGridItem>
		))
		}
		</AdaptivGrid>
		{
		(auth.role === "admin")?
		<NavLink className='fab-btn' to="/devices/add">+</NavLink>:
		null
		}
	</div>
  )
}
