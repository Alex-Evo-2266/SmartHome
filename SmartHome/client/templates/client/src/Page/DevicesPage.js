import React, {useContext,useEffect,useState,useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {NewDeviceElement} from '../components/moduls/newDeviceElement'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {MenuContext} from '../components/Menu/menuContext'

export const DevicesPage = () => {
  const history = useHistory()
  const allDevices = useContext(DeviceStatusContext)
  const {setData} = useContext(MenuContext)

  const [devices, setDevices] = useState([]);
  const [serchData, setSerchData] = useState("");

  useEffect(()=>{
    if(serchData===""){
      setDevices(allDevices.devices)
      return
    }
    let array = allDevices.devices.filter(item => item&&item.DeviceName.indexOf(serchData)!==-1)
    setDevices(array)
  },[allDevices.devices,serchData])

  const searchout = useCallback((data)=>{
    setSerchData(data)
  },[])

  useEffect(()=>{
    setData("Device All",{
      specialAction:{
        type: "add",
        action:()=>history.push("/devices/add")
      },
      search:searchout
    })
  },[setData,history,searchout])

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
