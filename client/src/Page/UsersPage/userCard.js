import React,{useCallback,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { SUCCESS } from '../../components/alerts/alertTyps'
import { BaseCard } from '../../components/cards/baseCard'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import userDefault from '../../img/userNuN.png'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../store/reducers/dialogReducer'

export const UserCard = ({user,updata})=>{
	const {request, error, clearError} = useHttp()
	const {message} = useMessage()
	const auth = useSelector(state=>state.auth)
	const userself = useSelector(state=>state.user) 

	const dispatch = useDispatch()

	const deleteUser = useCallback(async() =>{
		try{
			await request(`/api/users/${user.id}`, "DELETE", null, {Authorization: `Bearer ${auth.token}`})
			message("user delete", SUCCESS)
			if(typeof(updata) === "function")
				updata()
		}
		catch
		{
		}
	},[request, message, updata, user.id, auth.token])

	const deleteUserMessage = () => {
		dispatch(showAlertDialog("Delete user", "are you sure you want to delete the user", [{
			title: "ok",
			action: deleteUser
		}]))
	}

	const editRole = useCallback(async(role) =>{
		try{
			await request(`/api/users/level`, "PUT", {id:user.id, role}, {Authorization: `Bearer ${auth.token}`})
			if(typeof(updata) === "function")
				updata()
			dispatch(hideDialog())
		}
		catch
		{
		}
	},[request, updata, dispatch, auth.token, user.id])

	const roleUserMessage = () => {
		dispatch(showConfirmationDialog("edit role", [
			{title: "none", data: "none"},
			{title: "base", data: "base"},
			{title: "admin", data: "admin"},
		], editRole))
	}

	useEffect(()=>{
    	message(error,"error")
    	return ()=>{
      		clearError();
    	}
  	},[error,message, clearError])

	return(
		<BaseCard>
			<div className='card-img circle'>
			{
				(user.image_url)?
				<img alt="profile_img" src={user.image_url}/>:
				<img alt="profile_img" src={userDefault}/>
			}
			</div>
			<div className='card-content'>
				<h2>{user.name}</h2>
				{
					(user.auth_type !== "login")?
					<p>external name: {user.auth_name}</p>:
					null
				}
				{
					(user.email)?
					<p>email: {user.email}</p>:
					null
				}
				<p>role: {user.role}</p>
			</div>
			{
				(user.id === userself.id)?
				<>
				<div className='dividers'></div>
				<div className='card-btn-container'>
					<NavLink to="/profile" className="btn border">edit</NavLink>
				</div>
				</>:
				(auth.role === "admin")?
				<>
				<div className='dividers'></div>
				<div className='card-btn-container'>
					<button className='btn border' onClick={roleUserMessage}>edit role</button>
					<button className='btn red' onClick={deleteUserMessage}>delete</button>
				</div>
				</>
				:null
			}
			

		</BaseCard>
	)
}
