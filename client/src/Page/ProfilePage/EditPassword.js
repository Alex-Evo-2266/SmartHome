import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { setTitle } from '../../store/reducers/menuReducer'

export const EditPasswordPage = () => {
  const auth = useSelector(state=>state.auth)
  const user = useSelector(state=>state.user)
  const {request, error, clearError} = useHttp()
  const dispatch = useDispatch()
  const {message} = useMessage();
  const [focus, setFocus] = useState(false)
  const [password, setPassword] = useState({
	new_password: "",
	old_password: ""
  })

  useEffect(()=>{
	dispatch(setTitle("Edit password"))
  },[dispatch])

  useEffect(()=>{
	message(error,"error")
	return ()=>{
		clearError();
	}
  },[error,message, clearError])

  const changeHandler = event => {
	setPassword({ ...password, [event.target.name]: event.target.value })
  }

  const outForm = async() =>{
	try{
		await request("/api/users/password", "PUT", password, {Authorization: `Bearer ${auth.token}`})
		message("config update", "success")
	}
	catch{}
  }


  return(
	<div className = {`container ${(focus)?"glass-normal-dark":"glass-normal"}`}>
		<div className = "pagecontent">
			<h2>Change password</h2>
			<p>Name: {user.name}</p>
			<div className="configElement">
				<div className="input-data">
					<input onChange={changeHandler} onBlur={()=>setFocus(false)} onFocus={()=>setFocus(true)} required name="old_password" type="password" value={password.old_password}></input>
					<label>Old password</label>
				</div>
			</div>
			<div className="configElement">
				<div className="input-data">
					<input onChange={changeHandler} onBlur={()=>setFocus(false)} onFocus={()=>setFocus(true)} required name="new_password" type="password" value={password.new_password}></input>
					<label>New password</label>
				</div>
			</div>
			<div className="dividers"></div>
			<div className="configElement block">
				<button style={{width: "100%"}} className="btn" onClick={outForm}>Save</button>
			</div>
		</div>
	</div>
  )
}
