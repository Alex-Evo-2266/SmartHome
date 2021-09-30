import React, {useContext,useState,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'

export const AddScriptDevices = ({result,type,typeDev=null})=>{
  const {devices} = useContext(SocketContext)
  const [filteredDevices,setFilteredDevices] = useState([])

  const out=(item)=>{
    if(typeof(result)==="function")
      result(item)
  }

  const filtered = useCallback(()=>{
      setFilteredDevices(devices.filter((item)=>{
        let flag = false
        for (var item2 of item.DeviceConfig) {
          if(
            (typeDev==="number"&&(item2.type==="number"||item2.type==="binary"))||
            (typeDev==="binary"&&item2.type==="binary")||
            (typeDev==="text")||
            (typeDev==="enum"&&item2.type==="enum")||
            (!typeDev)
          )flag = true
          if(flag&&(type!=="act"||item2.control))
            return true
        }
        return false
      }))
  },[devices,type,typeDev])

  useEffect(()=>{
    filtered()
  },[filtered])

  return(
    <div className="box">
      <h2>type control element</h2>
        <ul>
        {
          filteredDevices.map((item,index)=>{
            return(
              <li key={index} onClick={()=>out(item)}>
                <span>{index+1}</span>{item.DeviceName}
              </li>
            )
          })
        }
        </ul>
      </div>
  )

}
