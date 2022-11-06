import React from 'react'
import { useAuth } from '../../hooks/auth.hook'


export const NonePage = function (){
	const {logout} = useAuth()
  
	return(
    <div className='nonePage-container'>
	<div className='logout nonePage'>
		<button className="btn nonePage" onClick={()=>logout()}>
			<i className="fas fa-sign-out-alt"></i>
			<span>  logout</span>
		</button>
	</div>
	<h1 className='nonePage'>
	The administrator has not yet given you a role
	</h1>
	</div>
	)
}
