import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {RunText} from '../../runText'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const SensorElement = ({index,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(SocketContext)
  const {target} = useContext(CartEditContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
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
  return null;
}
if(getTypeField()==="number"||getTypeField()==="text"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name RunTextBaseColor" id={device.DeviceName} text={device.DeviceName}/>
        <RunText className="sensor-value-name RunTextBaseColor" id={data.typeAction} text={data.typeAction}/>

        <p className= "sensor-value">{(device.DeviceValue)?device.DeviceValue[data.typeAction]:""}</p>
        <p className= "sensor-unit">{getConfrg(data.typeAction)?.unit||""}</p>
      </div>
      {
        (deleteBtn || editBtn)?
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
        </div>:
        null
      }
    </div>
  )
}
if(getTypeField()==="binary"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name RunTextBaseColor" id={device.DeviceName} text={device.DeviceName}/>
        <RunText className="sensor-value-name RunTextBaseColor" id={data.typeAction} text={data.typeAction}/>
        <div className={`valueIndicator ${(device?.DeviceValue&&device?.DeviceValue[data?.typeAction]==="1")?"true":"false"}`}></div>
      </div>
      {
        (deleteBtn || editBtn)?
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
        </div>:
        null
      }
    </div>
  )
}

return(
  <div className="SensorElement BtnElement">
    <div className="icon-conteiner">
      <RunText className="sensor-value-name RunTextBaseColor" id={data.typeAction} text={data.typeAction}/>
      <RunText
      className="sensor-value RunTextBaseColor"
      id={`${(device.DeviceValue)?device.DeviceValue[data.typeAction]:""} ${getConfrg(data.typeAction).unit||""}`}
      text={`${(device.DeviceValue)?device.DeviceValue[data.typeAction]:""} ${getConfrg(data.typeAction).unit||""}`}
      />
      <RunText className="sensor-name RunTextBaseColor" id={data.DeviceName} text={data.DeviceName}/>
    </div>
    {
      (deleteBtn || editBtn)?
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
      :null
    }
  </div>
)
}
