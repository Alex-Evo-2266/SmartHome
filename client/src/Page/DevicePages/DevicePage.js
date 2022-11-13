import React,{useCallback, useEffect} from 'react'
import { useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setSearch, setTitle } from '../../store/reducers/menuReducer'


export const DevicePage = () => {

  const dispatch = useDispatch()

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
  },[dispatch, searchout])

  return(
    <div className='contaimer fab'>

		<NavLink className='fab-btn' to="/devices/add">+</NavLink>
    </div>
  )
}
