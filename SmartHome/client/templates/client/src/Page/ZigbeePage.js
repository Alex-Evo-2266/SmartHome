import React,{useEffect,useState,useCallback,useContext} from 'react'
import {Header} from '../components/moduls/header'
import {Loader} from '../components/Loader'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {ZigbeeElement} from '../components/moduls/zigbeeCard/Card'

export const ZigbeePage = ()=>{
  const auth = useContext(AuthContext)
  const [device,setDevice] = useState([])
  const {loading, request} = useHttp();

  const rebootStik = () => {
    request('/api/zigbee2mqtt/reboot', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  }

  const zigbeeDevice = useCallback(async () => {
    try {
      let data = await request('/api/zigbee2mqtt/devices', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        console.log(data);
        setDevice(data)
      }
    } catch (e) {}
  },[request,auth.token])

  useEffect(()=>{
    zigbeeDevice()
  },[zigbeeDevice])

  return (
    <div className="conteiner bottom">
      <Header name="Zigbee2mqtt">
        <button onClick={rebootStik} className="btn"><i className="fas fa-undo"></i></button>
      </Header>
      {
        (loading)?
        <Loader/>:
        <div className="top">
        <div className = "Devices">
        <div className = "CardConteiner">
        {
          device.map((item,index)=>{
            return(
              <ZigbeeElement key={index} data={item.data}/>
            )
          })
        }
        </div>
        </div>
        </div>
      }
    </div>
  )
}
