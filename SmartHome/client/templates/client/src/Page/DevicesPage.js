import React, {useContext,useEffect,useState,useRef} from 'react'
import {NavLink} from 'react-router-dom'
// import {Loader} from '../components/Loader'
import {NewDeviceElement} from '../components/moduls/newDeviceElement'
import {DeviceStatusContext} from '../context/DeviceStatusContext'

export const DevicesPage = () => {
  const allDevices = useContext(DeviceStatusContext)

  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const read = useRef(0)

  useEffect(()=>{
    if(read.current<3){
      setDevices(allDevices.devices)
      read.current++
    }
  },[allDevices.devices])

  const searchout = ()=>{
    if(search===""){
      setDevices(allDevices.devices)
      return
    }
    let array = allDevices.devices.filter(item => item&&item.DeviceName.indexOf(search)!==-1)
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
      <div className = "conteiner top">
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
  )
}
