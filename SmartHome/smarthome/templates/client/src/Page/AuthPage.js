import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'


export const AuthPage = function (){
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [form, setForm] = useState({
    name: '', password: ''
  });

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId, data.userLavel)
    } catch (e) {
      console.error(e);
    }
  }

  return(
    <div className="row">
    <div className="title">
      <h1>Sing In Form</h1>
    </div>
    <div className="container-auth">
    <form>
      <div className="left-auth"></div>
      <div className="right-auth">

          <div className={`formBox-auth`}>
            <p>Name</p>
            <input placeholder="Online" id="name" type="text" name="name" value={form.name} onChange={changeHandler} required/>
            <p>Password</p>
            <input placeholder="•••••••" id="password" type="password" name="password" value={form.password} onChange={changeHandler} required/>
            <input type="submit" onClick={loginHandler} disabled={loading} value="Sign In"/>
            <Link to="/register">Register</Link>
          </div>
      </div>
    </form>
    </div>
    </div>
  )
}
