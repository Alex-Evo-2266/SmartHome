import React, {useCallback, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { UserCard } from './userCard'

export const UsersPage = () => {
	const auth = useSelector(state=>state.auth)
	const [users, setUsers] = useState([])
	const {request, error, clearError} = useHttp()
	const {message} = useMessage()

	const getUsers = useCallback(async()=>{
		const data = await request("/api/user/all", "GET", null, {Authorization: `Bearer ${auth.token}`})
		console.log(data)
		if(data)
		{
			setUsers(data)
		}
	},[request,auth.token])

	useEffect(()=>{
		getUsers()
	},[getUsers])

	useEffect(()=>{
		message(error, 'error');
		clearError();
	},[error, message, clearError])
	
	return(
		<div className='container flex'>
		{
			users.map((item, index)=>(
				<UserCard key={index} user={item} updata={getUsers}/>
			))
		}
		</div>
	)
}