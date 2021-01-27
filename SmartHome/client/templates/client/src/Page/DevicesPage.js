import React, {useContext,useEffect,useState,useCallback} from 'react'
import {FormContext} from '../components/Form/formContext'
import {Loader} from '../components/Loader'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {DeviceElement} from '../components/moduls/deviceElement'

export const DevicesPage = () => {
  const form = useContext(FormContext)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const updataDevice = useCallback(async()=>{
    const data = await request('/api/devices/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setDevices(data);
    setAllDevices(data);
  },[request,auth.token])

  useEffect(()=>{
    updataDevice()
  },[updataDevice])

  const searchout = ()=>{
    if(search===""){
      setDevices(allDevices)
      return
    }
    let array = allDevices.filter(item => item.DeviceName.indexOf(search)!==-1)
    setDevices(array)
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
    <>
      <div className = "conteiner">
        <header>
          <h1>All Devices</h1>
          <button className="titleButtonAdd"><i onClick={()=>{form.show("AddDevices",updataDevice)}} className="fas fa-plus"></i></button>
          <input type="search" name="search" id="searchDevices" onChange={searchHandler} onKeyDown={keyd} value={search}/>
          <button onClick={searchout} className="searchBtn">Search</button>
        </header>
        <div className = "Devices">
          {
            (loading)?
            <Loader/>:
            (!devices||devices.length === 0)?
            <h2 className="empty">Not elements</h2>:
            <div className = "CardConteiner">
              {
                devices.map((item,index)=>{
                  return(
                    <DeviceElement
                      key = {index}
                      DeviceId = {item.DeviceId}
                      DeviceName = {item.DeviceName}
                      DeviceSystemName = {item.DeviceSystemName}
                      DeviceType = {item.DeviceType}
                      powerTopic = {item.DeviceConfig.power||item.DeviceConfig.status||""}
                      DeviceTypeConnect = {item.DeviceTypeConnect}
                      DeviceInformation={item.DeviceInformation}
                      updataDevice={updataDevice}
                    />
                  )
                })
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}
