import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const SensorElement = ({index,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const {target} = useContext(CartEditContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    console.log(devices);
    let condidat = devices.filter((item)=>item.DeviceId===id)
    return condidat[0]
  },[devices])

  useEffect(()=>{
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById])

  function getConfrg(key) {
    for (var item of device.DeviceConfig) {
      if(item.type === key)
        return item
    }
  }


  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data,index},editBtn)
    }
  }

if(!device||!device.DeviceId){
  return null;
}
return(
  <div className="SensorElement BtnElement">
    <div className="icon-conteiner">
      <p className= "sensor-value-name">{data.typeAction}</p>
      <p className= "sensor-value">{`${device.DeviceValue[data.typeAction]} ${getConfrg(data.typeAction).unit||""}`}</p>
      <p className= "sensor-name">{device.DeviceName}</p>
    </div>
    <div className="delete-box">
    {
      (deleteBtn)?
      <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
      null
    }
    {
      (editBtn)?
      <button className="editBtn" onClick={editbtn}>
        <i className="fas fa-list i-cost"></i>
      </button>:
      null
    }
    </div>
  </div>
)
}
