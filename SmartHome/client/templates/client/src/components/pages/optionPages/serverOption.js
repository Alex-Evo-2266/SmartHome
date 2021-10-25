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
    passwordMqttBroker:'',
    zigbee2mqttTopic:'',
    emailLogin:'',
    emailPass:''
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
    console.log(data);
    if(!data)return;
    setServerconf({
      mqttBroker:data.mqttBroker||"",
      mqttBrokerPort:data.mqttBrokerPort||"",
      loginMqttBroker:data.loginMqttBroker||"",
      passwordMqttBroker:data.passwordMqttBroker||"",
      zigbee2mqttTopic:data.zigbee2mqttTopic||"",
      emailLogin:data.emailLogin||"",
      emailPass:data.emailPass||"",
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
      <div className="configTitle">
        <p className="text">Mqtt broker</p>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="mqttBroker" type="text" value={serverconf.mqttBroker} disabled = {(serverconf.mqttBroker==="none")}></input>
          <label>ip</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="mqttBrokerPort" type="number" value={serverconf.mqttBrokerPort} disabled = {(serverconf.mqttBroker==="none")}></input>
          <label>port</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="loginMqttBroker" type="text" value={serverconf.loginMqttBroker} disabled = {(serverconf.mqttBroker==="none")}></input>
          <label>login</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="passwordMqttBroker" type="text" value={serverconf.passwordMqttBroker} disabled = {(serverconf.mqttBroker==="none")}></input>
          <label>password</label>
        </div>
      </div>
      <div className="dividers"></div>
      <div className="configTitle">
        <p className="text">Zigbee2mqtt</p>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="zigbee2mqttTopic" type="text" value={serverconf.zigbee2mqttTopic} disabled = {(serverconf.mqttBroker==="none")}></input>
          <label>topic</label>
        </div>
      </div>
      <div className="dividers"></div>
      <div className="configTitle">
        <p className="text">Server email</p>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="emailLogin" type="email" value={serverconf.emailLogin}/>
          <label>login</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="emailPass" type="text" value={serverconf.emailPass}/>
          <label>password</label>
        </div>
      </div>
      <div className="dividers"></div>
      <div className="configElement block">
        <button style={{width: "100%"}} className="normalSelection button" onClick={serverConfigHandler}>Save</button>
      </div>
    </div>
)
}
