import React, {useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { clear_menu, setSearch, setTitle } from '../../store/reducers/menuReducer'
import { UserCard } from './userCard'

export const UsersPage = () => {
	const auth = useSelector(state=>state.auth)
	const [users, setUsers] = useState([])
	const dispatch = useDispatch()
	const {request, error, clearError} = useHttp()
	const {message} = useMessage()
	const [allUsers, setAllUsers] = useState([])

	const getUsers = useCallback(async()=>{
		const data = await request("/api/users/all", "GET", null, {Authorization: `Bearer ${auth.token}`})
		console.log(data)
		if(data)
		{
			setUsers(data)
			setAllUsers(data)
		}
	},[request,auth.token])

	const searchout = useCallback((search)=>{
		if(search===""){
		  setUsers(allUsers)
		  return
		}
		let array = allUsers.filter(item => (item.name.toLowerCase().indexOf(search.toLowerCase())!==-1))
		setUsers(array)
	  },[allUsers])

	useEffect(()=>{
		dispatch(setTitle("Users"))
		dispatch(setSearch(searchout))
		return ()=>dispatch(clear_menu())
	  },[dispatch, searchout])

	useEffect(()=>{
		getUsers()
	},[getUsers])

	useEffect(()=>{
		message(error, 'error');
		clearError();
	},[error, message, clearError])
	
	return(
		<div className='container flex fab'>
		{
			users.map((item, index)=>(
				<UserCard key={index} user={item} updata={getUsers}/>
			))
		}
		{
			(auth.role === "admin")?
			<NavLink className='fab-btn' to="/users/add">+</NavLink>:
			null
		}
		</div>
	)
}