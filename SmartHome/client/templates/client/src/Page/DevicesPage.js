import React, {useContext,useEffect,useState,useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {NewDeviceElement} from '../components/newDeviceElement'
import {SocketContext} from '../context/SocketContext'
import {AuthContext} from '../context/AuthContext.js'
import {MenuContext} from '../components/Menu/menuContext'

export const DevicesPage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const allDevices = useContext(SocketContext)
  const {setData} = useContext(MenuContext)

  const [devices, setDevices] = useState([]);
  const read = useRef(0)

  useEffect(()=>{
    if(read.current<3){
      setDevices(allDevices.devices)
      read.current++
    }
  },[allDevices.devices])

  const searchout = useCallback((data)=>{
    console.log(data);
    if(data===""){
      setDevices(allDevices.devices)
      return
    }
    let array = allDevices.devices.filter(item => item&&item.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
    setDevices(array)
  },[allDevices.devices])

  useEffect(()=>{
    setData("Device All",{
      specialAction:(auth.userLevel >= 3)?{
        type: "add",
        action:()=>history.push("/devices/add")
      }:null,
      search: searchout
    })
  },[setData, history, searchout, auth.userLevel])

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
                      <NewDeviceElement key = {index} systemName={item.systemName}/>
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
