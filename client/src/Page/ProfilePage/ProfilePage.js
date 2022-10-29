import React, {useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from '../../store/reducers/menuReducer'

export const ProfilePage = () => {
  const auth = useSelector(state=>state.auth)
  const user = useSelector(state=>state.user)
  const dispatch = useDispatch()

  useEffect(()=>{
	dispatch(setTitle("Profile"))
  },[dispatch])

  console.log(user)

  return(
	<div className = {`conteiner glass-normal`}>
			<i className="fas fa-sign-out-alt logout-btn" onClick={auth.logout}></i>
			<div className = "pagecontent">
				<h2>Profile</h2>
				<div className='img-container'>
					<img alt="profile_img" src={user.image_url}/>
				</div>
				<p>User Name: {user.name}</p>
				<p>User Email: {user.email||"NuN"}</p>
				<p>User Role: {auth.role}</p>
				<p>User authorization type: {user.auth_type}</p>
				<div className="dividers"></div>
				<div className="controlElement">
				{
					(user.auth_type === "login")?
					<>
						<NavLink to = "/profile/edit" className="btn">Edit profile</NavLink>
						<NavLink to = "/profile/editPass" className="btn">Edit password</NavLink>
					</>:
					<>
						<a href= {`${user.host}/profile/edit`} className="btn">Edit profile</a>
						<a href = {`${user.host}/profile`} className="btn">Edit password</a>
					</>
				}
				
			  </div>
			</div>
		  </div>
  )
}
