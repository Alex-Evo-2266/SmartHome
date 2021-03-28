import React, {useContext,useState,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import imgLight from '../../../img/lightDevices.jpg';
import imgDimmer from '../../../img/dimmerDevices.jpg';
import imgIr from '../../../img/IR.jpg';
import imgSensor from '../../../img/sensorDevices.jpg';
import imgSwitch from '../../../img/switchDevices.jpg';
import imgBinarySensor from '../../../img/binarySensorDevices.jpg';
import imgUndefined from '../../../img/icon-sensor.png';

export const AddScriptDevices = ({result,type})=>{
  const {devices} = useContext(DeviceStatusContext)
  const [filteredDevices,setFilteredDevices] = useState([])

  const out=(item)=>{
    if(typeof(result)==="function")
      result(item)
  }

  const filtered = useCallback((typeDev)=>{
    let condidat
    if(typeDev==="statusDev")
      condidat = devices.filter((item)=>item.DeviceType!=="ir")
    if(typeDev==="actDev")
      condidat = devices.filter((item)=>(item.DeviceType!=="sensor"&&item.DeviceType!=="binarySensor"))
    return condidat;
  },[devices])

  useEffect(()=>{
    if(type==="if")
      return setFilteredDevices(filtered("statusDev"))
    if(type==="act")
      return setFilteredDevices(filtered("actDev"))
    return setFilteredDevices(devices);
  },[devices,type,filtered])

  // <img alt={"type icon"} src={
  //   (item.DeviceType==="light")?imgLight:
  //   (item.DeviceType==="switch")?imgSwitch:
  //   (item.DeviceType==="sensor")?imgSensor:
  //   (item.DeviceType==="binarySensor")?imgBinarySensor:
  //   (item.DeviceType==="dimmer")?imgDimmer:
  //   (item.DeviceType==="ir")?imgIr:
  //   imgUndefined
  // }/>

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
