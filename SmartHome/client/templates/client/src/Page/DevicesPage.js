import React, {useContext,useEffect,useState,useCallback} from 'react'
import {NavLink} from 'react-router-dom'
import {Loader} from '../components/Loader'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {NewDeviceElement} from '../components/moduls/newDeviceElement'
import {DeviceStatusContext} from '../context/DeviceStatusContext'

export const DevicesPage = () => {
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [cost, setCost] = useState(true)
  const [interval, setInterval] = useState(2)
  const [read, setRead] = useState(0)

  const updataDevice = useCallback(async()=>{
    const data = await request('/api/devices/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setAllDevices(data);
  },[request,auth.token])

  useEffect(()=>{
    console.error(error);
    return ()=>{
      clearError();
    }
  },[error, clearError])

  useEffect(() => {
    const interval2 = setTimeout(() => {
      updataDevice()
      setCost((prev)=>!prev)
    }, interval*1000);
    return () => {
      return clearTimeout(interval2);
    }
  },[cost,interval,updataDevice]);

  const importCarts = useCallback(async()=>{
    try {
      const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setInterval(data2.server.updateFrequency)
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  useEffect(()=>{
    if(read<3){
      setDevices(allDevices)
      setRead(read+1)
    }
  },[allDevices])


  useEffect(()=>{
    updataDevice()
    importCarts()
  },[updataDevice])

  const searchout = ()=>{
    if(search===""){
      setDevices(allDevices)
      updataDevice()
      return
    }
    let array = allDevices.filter(item => item.DeviceName.indexOf(search)!==-1)
    setDevices(array)
    updataDevice()
  }

  const searchHandler = event => {
    setSearch(event.target.value)
  }

  const keyd = (e)=>{
    if(e.keyCode===13){
      searchout()
    }
  }

  return(
    <DeviceStatusContext.Provider value={{devices:allDevices, updateDevice:updataDevice}}>
      <div className = "conteiner">
        <header>
          <h1>All Devices</h1>
          <NavLink to="/devices/add" className="titleButtonAdd"><i className="fas fa-plus"></i></NavLink>
          <input type="search" name="search" id="searchDevices" onChange={searchHandler} onKeyDown={keyd} value={search}/>
          <button onClick={searchout} className="searchBtn">Search</button>
        </header>
        <div className = "Devices">
          {
            (!devices||devices.length === 0)?
            <h2 className="empty">Not elements</h2>:
            <div className = "CardConteiner">
              {
                devices.map((item,index)=>{
                  if(item)
                    return(
                      <NewDeviceElement key = {index} id={item.DeviceId}/>
                    )
                  return null
                })
              }
            </div>
          }
        </div>
      </div>
    </DeviceStatusContext.Provider>
  )
}
