import React, {useState, useEffect, useContext, useCallback} from 'react'
// import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {DialogWindowContext} from '../components/dialogWindow/dialogWindowContext'


export const FirstPage = function ({updata}){
  const auth = useContext(AuthContext)
  const dialog = useContext(DialogWindowContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [clientId, setClientId] = useState(null)
  const [authservice, setAuthservice] = useState(null)
  const [form, setForm] = useState({
    host: '', clientId: '', clientSecret: ''
  });

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const sendAuthService = async() => {
    try
    {
      await request('/api/firststart', 'POST', {...form})
      if (typeof(updata) === "function") 
        updata()
    }
    catch
    {}
  }

  return(
    <div className="row">
    <div className="title">
      <h1>auth service</h1>
    </div>
    <div className="container-auth">
      <div className="left-auth"></div>
      <div className="right-auth">
          <div className={`formBox-auth`}>
            <p>Host</p>
            <input placeholder="host" id="host" type="text" name="host" value={form.host} onChange={changeHandler} required/>
            <p>Client id</p>
            <input placeholder="clientId" id="clientId" type="text" name="clientId" value={form.clientId} onChange={changeHandler} required/>
            <p>Client secret</p>
            <input placeholder="clientSecret" id="clientSecret" type="text" name="clientSecret" value={form.clientSecret} onChange={changeHandler} required/>
            <input type="submit" onClick={sendAuthService} disabled={false} value="Sign In"/>
          </div>
      </div>
    </div>
    </div>
  )
}
