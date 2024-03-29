import React,{useState,useEffect,useContext,useCallback} from 'react'
import {SocketContext} from '../../context/SocketContext'

export const ValueDeviceBlock = ({data,updata,index,type,deleteEl,block})=>{
  const [device, setDevice]=useState({})
  const {devices} = useContext(SocketContext)
  const [field,setField] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    return devices.filter((item)=>item.systemName===id)[0]
  },[devices])

  const lookForField = (device,name)=>{
    return device.fields.filter((item)=>item.name===name)[0]
  }

  useEffect(()=>{
    setDevice(lookForDeviceById(data.systemName))
    setField(lookForField(lookForDeviceById(data.systemName),data.action))
  },[lookForDeviceById,data])

  const changeSelector = event=>{
    setField(lookForField(lookForDeviceById(data.systemName),data.action))
    updata({index,action:event.target.value})
  }

  const filtredOption = (options)=>options.filter((item)=>(
    (type==="number"&&(item.type==="number"||item.type==="binary"))||
    (type==="binary"&&item.type==="binary")||
    (type==="text")||
    (type==="enum"&&item.type==="enum")||
    (!type)
  ))

  if(Object.keys(device).length === 0 || Object.keys(field).length === 0){
    return null
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        {(device)?device.name:"Name"}
      </div>
      <div className="programm-function-block-content-item">
        <select value={field.name} onChange={changeSelector} name="property">
          {
            filtredOption(device.fields).map((item,index)=>{
              return(
                <option key={index} value={item.name}>{item.name}</option>
              )
            })
          }
        </select>
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index,block)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
