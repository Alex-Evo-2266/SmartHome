import React, {useState, useEffect, useContext, useCallback} from 'react'
// import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {useLocation} from "react-router-dom"
import {DialogWindowContext} from '../components/dialogWindow/dialogWindowContext'
import {FirstPage} from './FirstPage'
import { parseURL } from '../utils/urlParse'

const STATE = "sdrtfyujkllhmgfdsfgncfghcfgfnb"

export const AuthPage = function (){
  const auth = useContext(AuthContext)
  const dialog = useContext(DialogWindowContext)
  const {message} = useMessage();
  let {search} = useLocation();
  const {loading, request, error, clearError} = useHttp();
  const [clientId, setClientId] = useState(null)
  const [authservice, setAuthservice] = useState(null)
  const [authservicehost, setAuthserviceHost] = useState(null)
  const [form, setForm] = useState({
    name: '', password: ''
  });


  useEffect(()=>{
    message(error,"general")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const getClientId = useCallback(async () => {
    const data = await request('/api/auth/clientid', 'GET', null)
    if (data && data.authservice)
    {
      setClientId(data.clientId)
      setAuthservice(!!data.authservice)
      setAuthserviceHost(data.host)
    }
  },[request])

  useEffect(()=>{
    getClientId()
  },[getClientId])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      if(data)
        auth.login(data.token, data.userId, data.userLavel)
    } catch (e) {
      console.error(e);
    }
  }

const newpass = ()=>{
  dialog.show("text",{
    title:"Password recovery",
    text:"input login",
    placeholder:"login",
    active:(data)=>{
      request('/api/user/password/new', 'POST', {name:data})
    }
  })
}

const getHost = ()=>{
  console.log(window.location.host)
  let host = window.location.host
  host = "http://" + host
  return host
}

const getAccess = useCallback(async(code)=>{
  const data = await request('/api/auth', 'POST', {"code": code})
  console.log(data)
},[])

useEffect(()=>{
  if (search)
  {
    let obj = parseURL(search)
    if (obj.state != STATE)
    {
      console.error("stеte error")
      return null
    }
    console.log(obj.code)
    getAccess(obj.code)
  }
},[getAccess])

  if (clientId === null || authservice === null || authservicehost == null)
    return <FirstPage/>

  else if (search)
  {
    return null
  }
  else if (authservicehost && clientId)
  {
    console.log(authservicehost)
    window.location.replace(`${authservicehost}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${getHost()}&state=${STATE}&scope=profile`)
  }

  

  return(
    <div className="row">
    <div className="title">
      <h1>Sing In Form</h1>
    </div>
    <div className="container-auth">
      <div className="left-auth"></div>
      <div className="right-auth">
          <div className={`formBox-auth`}>
            <p>Name</p>
            <input placeholder="Login" id="name" type="text" name="name" value={form.name} onChange={changeHandler} required/>
            <p>Password</p>
            <input placeholder="•••••••" id="password" type="password" name="password" value={form.password} onChange={changeHandler} required/>
            <input type="submit" onClick={loginHandler} disabled={loading} value="Sign In"/>
            <p onClick={newpass} style={{marginTop:"5px"}} className="liteButton">забыли пароль?</p>
          </div>
      </div>
    </div>
    </div>
  )
}
