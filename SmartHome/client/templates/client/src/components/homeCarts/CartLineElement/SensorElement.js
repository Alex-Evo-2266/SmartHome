import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {BaseElement} from './BaseElement'

export const SensorElement = ({index,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    let condidat = devices.filter((item)=>item.DeviceId===id)
    return condidat[0]
  },[devices])

  useEffect(()=>{
    if(!data||!data.deviceId)
      return
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById])

  const itemField = ()=>{
    if(!device||!device.DeviceConfig||!data.typeAction)return
    for (var item of device.DeviceConfig) {
      if(item.name===data.typeAction){
        return item
      }
    }
  }

  const getTypeField = ()=>{
    if(!device)return "text"
    for (var item of device.DeviceConfig) {
      if(data.typeAction === item.name){
        return item.type
      }
    }
    return "text"
  }

if(!device||!device.DeviceId){
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
        <p className= "sensor-name">{device.DeviceName}</p>
        <p className= "state">{`${device.DeviceValue[data.typeAction]} ${itemField().unit||""}`}</p>
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
        <p className= "sensor-name">{device.DeviceName}</p>
        <div className="control">
          <p className= "state">{`${device.DeviceValue[data.typeAction]} ${itemField().unit||""}`}</p>
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
    <p className= "sensor-name">{device.DeviceName}</p>
    <p className= "state">{`${device.DeviceValue[data.typeAction]} ${itemField().unit||""}`}</p>
  </BaseElement>
)
}