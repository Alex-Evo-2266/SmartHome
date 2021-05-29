import React,{useContext,useState,useEffect,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {Loader} from '../../Loader'

export const ServerOption = () =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [serverconf , setServerconf] = useState({
    mqttBroker:'none',
    mqttBrokerPort:"",
    loginMqttBroker:'',
    passwordMqttBroker:''
  });

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  // const checkedHandler = event => {
  //   setServerconf({ ...serverconf, [event.target.name]: event.target.checked })
  // }
  const changeHandler = event => {
    setServerconf({ ...serverconf, [event.target.name]: event.target.value })
  }

  const serverConfigHandler = async(event)=>{
    request(`/api/server/config`, 'PUT', serverconf,{Authorization: `Bearer ${auth.token}`})
  }

  const updataConf = useCallback(async()=>{
    const data = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data)return;
    setServerconf({
      mqttBroker:data.mqttBroker||"",
      mqttBrokerPort:data.mqttBrokerPort||"",
      loginMqttBroker:data.loginMqttBroker||"",
      passwordMqttBroker:data.passwordMqttBroker||""
    })
  },[request,auth.token])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  if(loading){
    return <Loader/>
  }

  return(
    <div className = "pagecontent">
      <div className="configElement">
        <h2>Server config</h2>
      </div>
      <div className="configElement">
        <p className="text">Mqtt broker ip</p>
        <label className="text">
          <input placeholder="IP Mqtt broker" onChange={changeHandler} name="mqttBroker" type="text" value={serverconf.mqttBroker} disabled = {(serverconf.mqttBroker==="none")}></input>
        </label>
        <p className="text">Mqtt broker port</p>
        <label className="text">
          <input placeholder="Port Mqtt broker" onChange={changeHandler} name="mqttBrokerPort" type="number" value={serverconf.mqttBrokerPort} disabled = {(serverconf.mqttBroker==="none")}></input>
        </label>
        <p className="text">Mqtt login</p>
        <label className="text">
          <input placeholder="login Mqtt broker" onChange={changeHandler} name="loginMqttBroker" type="text" value={serverconf.loginMqttBroker} disabled = {(serverconf.mqttBroker==="none")}></input>
        </label>
        <p className="text">Mqtt password</p>
        <label className="text">
          <input placeholder="password Mqtt broker" onChange={changeHandler} name="passwordMqttBroker" type="text" value={serverconf.passwordMqttBroker} disabled = {(serverconf.mqttBroker==="none")}></input>
        </label>
      </div>
      <button onClick={serverConfigHandler}>Save</button>
    </div>
)
}
