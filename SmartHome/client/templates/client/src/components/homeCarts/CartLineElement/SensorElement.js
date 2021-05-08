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
    setDevice(lookForDeviceById(data.IdDevice))
  },[devices,data,onClick,lookForDeviceById])


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
  <div className="sensor-box">
    <div className="sensor">
      <p className= "sensor-name">{device.DeviceName}</p>
      <p className= "sensor-value">{`${device.DeviceValue.status.value} ${device.DeviceConfig.unit||""}`}</p>
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
