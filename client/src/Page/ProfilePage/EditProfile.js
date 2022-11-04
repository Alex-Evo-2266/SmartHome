import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { setTitle } from '../../store/reducers/menuReducer'

export const EditProfilePage = () => {
  const auth = useSelector(state=>state.auth)
  const user = useSelector(state=>state.user)
  const {request, error, clearError} = useHttp()
  const dispatch = useDispatch()
	const {message} = useMessage();
  const [focus, setFocus] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  })

  useEffect(()=>{
    setUserData({
      name: user?.name ?? "",
      email: user?.email ?? ""
    })
  },[user])

  useEffect(()=>{
	dispatch(setTitle("Edit profile"))
  },[dispatch])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
        clearError();
    }
  },[error,message, clearError])

  const changeHandler = event => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  const outForm = async() =>{
    try{
      await request("/api/user", "PUT", userData, {Authorization: `Bearer ${auth.token}`})
      message("config update", "success")
    }
    catch{}
  }


  return(
    <div className = {`container ${(focus)?"glass-normal-dark":"glass-normal"}`}>
    <div className = "pagecontent">
    <h2>Profile</h2>
    <div className="configElement">
      <div className="input-data">
        <input onChange={changeHandler} onBlur={()=>setFocus(false)} onFocus={()=>setFocus(true)} required name="name" type="text" value={userData.name}></input>
        <label>Name</label>
      </div>
    </div>
    <div className="configElement">
      <div className="input-data">
        <input onChange={changeHandler} onBlur={()=>setFocus(false)} onFocus={()=>setFocus(true)} required name="email" type="email" value={userData.email}></input>
        <label>Email</label>
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
