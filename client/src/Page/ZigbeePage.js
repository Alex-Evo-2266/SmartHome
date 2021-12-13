import React,{useEffect,useState,useCallback,useContext, useRef} from 'react'
import {Loader} from '../components/Loader'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {SocketContext} from '../context/SocketContext'
import {MenuContext} from '../components/Menu/menuContext'
import {ZigbeeElement} from '../components/zigbeeCard/Card'

export const ZigbeePage = ()=>{
  const auth = useContext(AuthContext)
  const {message} = useContext(SocketContext)
  const [device,setDevice] = useState([])
  const [allDevice,setAllDevice] = useState([])
  const [permitJoin,setPermitJoin] = useState(false)
  const read = useRef(0)
  const {setData} = useContext(MenuContext)
  const {loading, request} = useHttp();

  const rebootStik = useCallback(() => {
    request('/api/zigbee2mqtt/reboot', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  },[request,auth.token])

  const pairing = useCallback((state) => {
    setPermitJoin(state)
    request('/api/zigbee2mqtt/permit_join', 'POST',{state},{Authorization: `Bearer ${auth.token}`})
  },[request, auth.token])

  const zigbeeDevice = useCallback(async () => {
    try {
      let data = await request('/api/zigbee2mqtt/devices', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        setAllDevice(data)
      }
      let data2 = await request('/api/zigbee2mqtt/permit_join', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      setPermitJoin(data2)
    } catch (e) {}
  },[request,auth.token])

  useEffect(()=>{
    zigbeeDevice()
  },[zigbeeDevice])

  useEffect(()=>{
    if(message.type==="zigbee")
      setAllDevice(message.data)
  },[message])

  useEffect(()=>{
    if(read.current<3){
      setDevice(allDevice)
      read.current++
    }
  },[allDevice])

  const searchout = useCallback((data)=>{
    if(data===""){
      setDevice(allDevice)
      return
    }
    let array = allDevice.filter(item => item&&item.data.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
    setDevice(array)
  },[allDevice])

  useEffect(()=>{
    setData("Zigbee",{
      search: searchout,
      dopmenu: [
        {
          title:"update",
          onClick:zigbeeDevice
        },
        {
          title:"reboot",
          onClick:rebootStik
        },
        {
          title:"pairing mode",
          active:permitJoin,
          onClick:()=>pairing(!permitJoin)
        },
      ]
    })
  },[setData,zigbeeDevice,permitJoin,rebootStik,pairing,searchout])

  return (
    <div className="conteiner bottom">
      {
        (loading)?
        <Loader/>:
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
      }
    </div>
  )
}