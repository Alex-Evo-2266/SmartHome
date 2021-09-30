import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {AuthContext} from '../../../context/AuthContext.js'
import {RunText} from '../../runText'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const SliderElement = ({index,data,min=0,max=100,disabled=false,firstValue=0,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const [value , setValue] = useState(firstValue)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [disabled2, setDisabled] = useState(disabled)
  const [device, setDevice] = useState({})
  const [minstate, setMin] = useState(0)
  const [maxstate, setMax] = useState(100)
  const {target} = useContext(CartEditContext)

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0]||!data)
      return false
    let condidat = devices.filter((item)=>item&&item.DeviceId===id)
    if(!condidat[0]) return null
    let conf
    for (var item of condidat[0].DeviceConfig) {
      if(item.name===data.typeAction){
        conf = item
      }
    }
    setMin(conf.low)
    setMax(conf.high)
    return condidat[0]
  },[devices,data])

  const outValue = async(v)=>{
    await request('/api/devices/value/set', 'POST', {id: data.deviceId,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(!data||!data.deviceId||typeof(onClick)==="function"){
      setMin(min)
      setMax(max)
      return
    }
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById,min,max])

  useEffect(()=>{
    if(!disabled&&device&&device.status){
      if(device.status==="online"){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
      return
    }
    if(!disabled&&!devices.length) {
      setDisabled(true)
    }else if(!disabled&&devices.length) {
      setDisabled(false)
    }
  },[device,disabled,devices])

  useEffect(()=>{
    if(typeof(onClick)==="function")return
    if(!device||!device.DeviceValue)return
    setValue(Number(device.DeviceValue[data.typeAction]))
  },[device,onClick,data])

  const changeHandler = (event)=>{
    setValue(event.target.value);
  }

  const mouseUp = (event)=>{
    if(typeof(onClick)==="function"){
      onClick(event, value,setValue)
    }
    outValue(value)

    // if(!data||!device)
    //   return
    // // if(data.type==="dimmer")
    // //     socket.terminalMessage(`device ${device.DeviceSystemName} dimmer ${value}`)
    // // if(data.type==="color")
    // //     socket.terminalMessage(`device ${device.DeviceSystemName} color ${value}`)
    // // // socket.terminalMessage()
    // return
    // // setTimeout(()=>updateDevice(),500)
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

if(!device){
  return null
}

return(
  <div className="slider-box">
    <RunText className="name" id={device.DeviceSystemName} text={`${device.DeviceName}.${data.typeAction}.`}/>
    <div className="slider">
      <input
      type="range"
      min={minstate}
      max={maxstate}
      value={value}
      onChange={changeHandler}
      onMouseUp={mouseUp}
      disabled={disabled2}
      />
    </div>
    <div className="value">{value}</div>
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
