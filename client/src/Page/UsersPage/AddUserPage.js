import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { SUCCESS } from '../../components/alerts/alertTyps'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import { setTitle } from '../../store/reducers/menuReducer'

export function AddUser(){
  const history = useHistory()
  const {loading, request, error, clearError} = useHttp();
  const {message} = useMessage();
  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const [form, setForm] = useState({
    name: '', password: '', email: ''
  });

  useEffect(()=>{
    dispatch(setTitle("Add user"))
  },[dispatch])

  useEffect(()=>{
    message(error, 'error');
    clearError();
    return ()=>clearError()
  },[error, message, clearError])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/user', 'POST', {...form}, {Authorization: `Bearer ${auth.token}`})
      if(data){
        history.push('/users')
        message("user registered",SUCCESS)
      }
    } catch (e) {
      console.error(e);
    }
  }

  return(
    <div className="container">
    <div className="title">
      <h1>Create user</h1>
    </div>
    <div className={`container-reg`}>
      <form>
        <div className={`main-reg clearfix`}>
          <div className="left-reg">
            <div className="formBox-reg">
              <p>userName</p>
              <input placeholder="UserName" id="userName" type="text" name="name" required onChange={changeHandler}/>
              <p>password</p>
              <input placeholder="•••••••" id="password" type="password" name="password" required onChange={changeHandler}/>
            </div>
          </div>
          <div className="right-reg">
            <div className="formBox-reg">
              <p>Email</p>
              <input placeholder="Email" id="email" type="email" name="email" onChange={changeHandler}/>
            </div>
          </div>
        </div>
        <div className="footer-reg">
          <div className="formBox-reg">
            <input type="submit" onClick={registerHandler} disabled={loading} value="Create"/>
          </div>
        </div>
      </form>
    </div>
    </div>
  )
}
