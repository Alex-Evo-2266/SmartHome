import React,{useCallback, useEffect} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useSocket } from '../../hooks/socket.hook'
import { clear_menu, setSearch, setTitle } from '../../store/reducers/menuReducer'
import { DeviceCard } from './deviceCard/deviceCard'


export const DevicePage = () => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const {devices} = useSelector(state=>state.socket)

  const searchout = useCallback((search)=>{
	// if(search===""){
	//   setUsers(allUsers)
	//   return
	// }
	// let array = allUsers.filter(item => (item.name.toLowerCase().indexOf(search.toLowerCase())!==-1))
	// setUsers(array)
  },[])

useEffect(()=>{
	dispatch(setTitle("Devices"))
	dispatch(setSearch(searchout))
	return ()=>dispatch(clear_menu())
  },[dispatch, searchout])

//   useEffect(()=>{
// 	console.log(devices)
//   },[devices])

  return(
    <div className='container flex fab'>
	{
		devices.map((item,index)=>(
			<DeviceCard key={index} device={item} systemName={devices.system_name}/>
		))
	}
	{
		(auth.role === "admin")?
		<NavLink className='fab-btn' to="/devices/add">+</NavLink>:
		null
	}
    </div>
  )
}
