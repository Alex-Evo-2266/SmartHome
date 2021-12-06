import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {RunText} from '../../runText'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const SensorElement = ({title,index,data,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(SocketContext)
  const {target} = useContext(CartEditContext)
  const [device, setDevice] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false

    let condidat = devices.filter((item)=>item.systemName===id)
    return condidat[0]
  },[devices])

  useEffect(()=>{
    setDevice(lookForDeviceById(data.deviceName))
  },[devices,data,onClick,lookForDeviceById])

  function getConfrg(key) {
    for (var item of device.config) {
      if(item.name === key)
        return item
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

if(!device||!device.systemName){
  return null;
}
if(getTypeField()==="number"||getTypeField()==="text"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name RunTextBaseColor" id={title} text={title}/>
        <p className= "sensor-value">{(device.value)?device.value[data.typeAction]:""}</p>
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
        <RunText className="sensor-name RunTextBaseColor" id={title} text={title}/>
        <div className={`valueIndicator ${(device?.value&&device?.value[data?.typeAction]==="1")?"true":"false"}`}></div>
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
      <RunText className="sensor-value-name RunTextBaseColor" id={title} text={title}/>
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
