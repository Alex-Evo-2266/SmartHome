import React, {useState, useEffect, useContext, useCallback, useRef} from 'react'
// import {Link} from 'react-router-dom'
import {AuthServiceBtn} from '../components/authServiceBtn/AutuServiceBtnComponent'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {useLocation} from "react-router-dom"
import {DialogWindowContext} from '../components/dialogWindow/dialogWindowContext'
import {FirstPage} from './FirstPage'
import { parseURL } from '../utils/urlParse'
import { useDispatch } from 'react-redux'
import { LOGIN } from '../store/types'

const STATE = "sdrtfyujkllhmgfdsfgncfghcfgfnb"

export const AuthPage = function (){
  const auth = useContext(AuthContext)
  const authServiceBtn = useRef(null)
  const dialog = useContext(DialogWindowContext)
  const {message} = useMessage();
  let {search} = useLocation();
  const dispatch = useDispatch()
  const {loading, request, error, clearError} = useHttp();
  const [clientId, setClientId] = useState(null)
  const [authservice, setAuthservice] = useState(null)
  const [authservicehost, setAuthserviceHost] = useState(null)
  const [form, setForm] = useState({
    name: '', password: ''
  });

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      if (!data) return ;
      dispatch({type: LOGIN, payload:{
        id: data?.id,
        role: data?.role,
        token: data?.token
      }})
    } catch (e) {
      console.error(e);
    }
  }

  const newpass = () => {}

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  return(
    <div className="row">
    <div className="title">
      <h1>Sing In Form</h1>
    </div>
    <div className="container-auth">
      <div className="left-auth"></div>
      <div className="right-auth">
          <div className={`formBox-auth`}>
            <AuthServiceBtn/>
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
