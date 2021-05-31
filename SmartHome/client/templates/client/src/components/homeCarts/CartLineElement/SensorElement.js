import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {BaseElement} from './BaseElement'

export const SensorElement = ({index,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    console.log(devices);
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
      if(item.type===data.typeAction){
        return item
      }
    }
  }

if(!device||!device.DeviceId){
  return null;
}
return(
  <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
    <div className="sensor">
      <p className= "sensor-name">{device.DeviceName}</p>
      <p className= "sensor-value">{`${device.DeviceValue[data.typeAction]} ${itemField().unit||""}`}</p>
    </div>
    <div className="delete-box">
    </div>
  </BaseElement>
)
}
