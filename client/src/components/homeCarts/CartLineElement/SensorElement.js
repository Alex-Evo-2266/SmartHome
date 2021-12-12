import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {BaseElement} from './BaseElement'

export const SensorElement = ({index,title,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(SocketContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    let condidat = devices.filter((item)=>item.systemName===id)
    return condidat[0]
  },[devices])

  useEffect(()=>{
    if(!data||!data.deviceName)
      return
    setDevice(lookForDeviceById(data.deviceName))
  },[devices,data,onClick,lookForDeviceById])

  const itemField = ()=>{
    if(!device||!device.config||!data.typeAction)return
    for (var item of device.config) {
      if(item.name===data.typeAction){
        return item
      }
    }
  }

  const getTypeField = ()=>{
    if(!device)return "text"
    for (var item of device.config) {
      if(data.typeAction === item.name){
        return item.type
      }
    }
    return "text"
  }

if(!device||!device.systemName){
  return null;
}
if(getTypeField()==="text"||getTypeField()==="number"){
  return(
    <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
    <div className="icon">
      <div className="circle">
      {
        (itemField()&&itemField().icon)?
        <i className={itemField().icon}></i>:
        <i className="fas fa-circle-notch"></i>
      }
      </div>
    </div>
        <p className= "sensor-name">{title}</p>
        <p className= "state">{`${device.value[data.typeAction]} ${itemField().unit||""}`}</p>
    </BaseElement>
  )
}
if(getTypeField()==="binary"){
  return(
    <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
    <div className="icon">
      <div className="circle">
      {
        (itemField()&&itemField().icon)?
        <i className={itemField().icon}></i>:
        <i className="fas fa-circle-notch"></i>
      }
      </div>
    </div>
        <p className= "sensor-name">{title}</p>
        <div className="control">
          <p className= "state">{`${device.value[data.typeAction]} ${itemField().unit||""}`}</p>
        </div>
    </BaseElement>
  )
}
return (
  <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
    <div className="icon">
      <div className="circle">
      {
        (itemField()&&itemField().icon)?
        <i className={itemField().icon}></i>:
        <i className="fas fa-circle-notch"></i>
      }
      </div>
    </div>
    <p className= "sensor-name">{title}</p>
    <p className= "state">{`${device.value[data.typeAction]} ${itemField().unit||""}`}</p>
  </BaseElement>
)
}
