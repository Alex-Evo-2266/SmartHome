import React,{useEffect,useState,useCallback,useContext} from 'react'
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
  const [searchtest,setSearchtest] = useState("")
  const [permitJoin,setPermitJoin] = useState(false)
  const {setData} = useContext(MenuContext)
  const {loading, request} = useHttp();

  const rebootStik = useCallback(() => {
    request('/api/module/zigbee2mqtt/reboot', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  },[request,auth.token])

  const pairing = useCallback((state) => {
    setPermitJoin(state)
    request('/api/module/zigbee2mqtt/permit_join/set', 'POST',{state},{Authorization: `Bearer ${auth.token}`})
  },[request, auth.token])

  const zigbeeDevice = useCallback(async () => {
    try {
      let data = await request('/api/module/zigbee2mqtt/device/all', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      console.log(data);
      if(data){
        setAllDevice(data)
      }
      let data2 = await request('/api/module/zigbee2mqtt/permit_join/get', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      setPermitJoin(data2.state)
    } catch (e) {}
  },[request,auth.token])

  useEffect(()=>{
    zigbeeDevice()
  },[zigbeeDevice])

  useEffect(()=>{
    if(message.type==="zigbee")
    {
      console.log(message);
      setAllDevice(message.data)
    }
  },[message])

  useEffect(()=>{
    if(searchtest===""){
      setDevice(allDevice)
      return
    }
    let array = allDevice.filter(item => item&&item.name.toLowerCase().indexOf(searchtest.toLowerCase())!==-1)
    setDevice(array)
  },[allDevice,searchtest])

  const searchout = useCallback((data)=>{
    setSearchtest(data)
  },[])

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
              <ZigbeeElement key={index} data={item}/>
            )
          })
        }
        </div>
        </div>
      }
    </div>
  )
}
