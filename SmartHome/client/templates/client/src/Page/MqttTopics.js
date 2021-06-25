import React,{useEffect,useState,useCallback,useContext} from 'react'
import {NavLink,Link} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {Loader} from '../components/Loader'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {MQTTElement} from '../components/moduls/mqttCards/mqttCard'

export const MqttPage = ()=>{
  const auth = useContext(AuthContext)
  const [deviceMqtt,setDeviceMqtt] = useState([])
  const {loading, request, error, clearError} = useHttp();
  const {message} = useMessage();

  const getDev = useCallback(async () => {
    try {
      let data = await request('/api/mqtt', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        console.log(data);
        setDeviceMqtt(data)
      }
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getDev()
  },[getDev])

  function clearMqtt() {
    request('/api/mqtt/clear', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  }

  return (
    <div className="conteiner">
      <Header name="Mqtt">
        <button onClick={getDev} className="btn"><i className="fas fa-undo"></i></button>
        <button onClick={clearMqtt} className="btn"><i className="fas fa-trash"></i></button>
      </Header>
      {
        (loading||!deviceMqtt)?
        <Loader/>:
        <div className="top">
          <table className="mqttTable">
            <thead><tr><th>Адресс</th><th>Сообщения</th><th>связанные устройства</th><th>Управление</th></tr></thead>
            <tbody>
            {
              deviceMqtt.map((item,index)=>{
                return (
                  <tr key={index}>
                    <MQTTElement data = {item}/>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}
