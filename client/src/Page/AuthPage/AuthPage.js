import React, {useState, useEffect} from 'react'
import {AuthServiceBtn} from './authServiceBtn/AutuServiceBtnComponent'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import { useDispatch } from 'react-redux'
import { LOGIN } from '../../store/types'


export const AuthPage = function (){
  const {message} = useMessage();
  const dispatch = useDispatch()
  const {loading, request, error, clearError} = useHttp();
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
