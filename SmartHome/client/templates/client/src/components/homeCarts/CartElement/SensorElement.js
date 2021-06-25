import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {RunText} from '../../runText'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const SensorElement = ({index,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const {target} = useContext(CartEditContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    console.log(id);
    if(!devices||!devices[0])
      return false

    let condidat = devices.filter((item)=>item.DeviceId===id)
    return condidat[0]
  },[devices])

  useEffect(()=>{
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById])

  function getConfrg(key) {
    for (var item of device.DeviceConfig) {
      if(item.name === key)
        return item
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
  console.log("wtf");
  return null;
}
if(getTypeField()==="number"||getTypeField()==="text"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name" id={device.DeviceName} text={device.DeviceName}/>
        <RunText className="sensor-value-name" id={data.typeAction} text={data.typeAction}/>

        <p className= "sensor-value">{device.DeviceValue[data.typeAction]}</p>
        <p className= "sensor-unit">{getConfrg(data.typeAction).unit||""}</p>
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
if(getTypeField()==="binary"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name" id={device.DeviceName} text={device.DeviceName}/>
        <RunText className="sensor-value-name" id={data.typeAction} text={data.typeAction}/>
        <div className={`valueIndicator ${(getConfrg(data.typeAction).high.toLowerCase()===device.DeviceValue[data.typeAction].toLowerCase())?"true":"false"}`}></div>
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
