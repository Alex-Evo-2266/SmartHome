import React, {useContext,useEffect,useState,useRef} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {NewDeviceElement} from '../components/moduls/newDeviceElement'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {MenuContext} from '../components/Menu/menuContext'

export const DevicesPage = () => {
  const history = useHistory()
  const allDevices = useContext(DeviceStatusContext)
  const {setData} = useContext(MenuContext)

  const [devices, setDevices] = useState([]);
  const read = useRef(0)

  useEffect(()=>{
    if(read.current<3){
      setDevices(allDevices.devices)
      read.current++
    }

  },[allDevices.devices])

  useEffect(()=>{
    setData("Device All",{
      type: "add",
      action:()=>history.push("/devices/add")
    })
  },[setData])

  const searchout = (data)=>{
    if(data===""){
      setDevices(allDevices.devices)
      return
    }
    let array = allDevices.devices.filter(item => item&&item.DeviceName.indexOf(data)!==-1)
    setDevices(array)
  }
  // <Header search={searchout} name="Device All">
  // <Link to="/devices/add" className="btn"><i className="fas fa-plus"></i></Link>
  // </Header>
  return(
      <div className = "conteiner top bottom">

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
