import React,{useEffect,useState,useCallback,useContext} from 'react'
import {Header} from '../components/moduls/header'
import {Loader} from '../components/Loader'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {MenuContext} from '../components/Menu/menuContext'
import {ZigbeeElement} from '../components/moduls/zigbeeCard/Card'

export const ZigbeePage = ()=>{
  const auth = useContext(AuthContext)
  const [device,setDevice] = useState([])
  const [permitJoin,setPermitJoin] = useState(false)
  const {setData} = useContext(MenuContext)
  const {loading, request} = useHttp();

  const rebootStik = () => {
    request('/api/zigbee2mqtt/reboot', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  }

  const pairing = (state) => {
    setPermitJoin(state)
    request('/api/zigbee2mqtt/permit_join', 'POST',{state},{Authorization: `Bearer ${auth.token}`})
  }

  const zigbeeDevice = useCallback(async () => {
    try {
      let data = await request('/api/zigbee2mqtt/devices', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        console.log(data);
        setDevice(data)
      }
      let data2 = await request('/api/zigbee2mqtt/permit_join', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      console.log(data2);
      setPermitJoin(data2)
    } catch (e) {}
  },[request,auth.token])

  useEffect(()=>{
    zigbeeDevice()
  },[zigbeeDevice])

  useEffect(()=>{
    console.log(permitJoin);
  },[permitJoin])

  useEffect(()=>{
    setData("Zigbee",{
      dopmenu: [
        {
          title:"update",
          active:zigbeeDevice
        },
        {
          title:"reboot",
          active:rebootStik
        },
        {
          title:"pairing mode",
          check:permitJoin,
          active:()=>pairing(!permitJoin)
        },
      ]
    })
  },[setData,zigbeeDevice,permitJoin])

  return (
    <div className="conteiner bottom">
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
