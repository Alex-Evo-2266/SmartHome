import React, {useState, useEffect,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AlertContext} from '../components/alert/alertContext'

export default function AddUser(){
  const history = useHistory()
  const {loading, request, error, clearError} = useHttp();
  const {message} = useMessage();
  const {show} = useContext(AlertContext);
  const [form, setForm] = useState({
    name: '', password: '', email: '', mobile: '', key: ''
  });

  useEffect(()=>{
    console.log("use");
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/user', 'POST', {...form})
      if(data){
        history.push('/')
        show("user registered","ok")
      }
    } catch (e) {
      console.error(e);
    }
  }

  return(
    <div className="conteiner top">
    <div className="title">
      <h1>Register Form</h1>
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
              <p>Mobile</p>
              <input placeholder="mobile" id="mobile" type="tel" name="mobile" maxleght="5" onChange={changeHandler}/>
            </div>
          </div>
        </div>
        <div className="footer-reg">
          <div className="formBox-reg">
            <input type="submit" onClick={registerHandler} disabled={loading} value="Register"/>
          </div>
        </div>
      </form>
    </div>
    </div>
  )
}
