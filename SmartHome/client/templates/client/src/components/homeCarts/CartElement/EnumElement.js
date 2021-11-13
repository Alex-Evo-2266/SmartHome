import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const EnumElement = ({data,title,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,deleteBtn}) =>{
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(firstValue)
  const [device, setDevice] = useState({})
  const [deviceConfig, setDeviceConfig] = useState({})
  const [disabled2, setDisabled] = useState(disabled)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const {target} = useContext(CartEditContext)

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(id,v)=>{
    await request('/api/devices/value/set', 'POST', {id: data.deviceId,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    let condidat = devices.filter((item)=>(item&&item.DeviceId===id))
    return condidat[0]
  },[devices])

  useEffect(()=>{
    if(!data||!data.deviceId||typeof(onClick)==="function")
      return
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById])

  const itemField = useCallback(()=>{
    if(!device||!device.DeviceConfig)return
    for (var item of device.DeviceConfig) {
      if(item.name===data.typeAction){
        return item
      }
    }
  },[data.typeAction,device])

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
    if(!device||!device.DeviceConfig||!data)return
    const {typeAction} = data
    let conf = device.DeviceConfig.filter((item)=>item.name===typeAction)
    if(conf.length)
      setDeviceConfig(conf[0])
  },[device,data])

  useEffect(()=>{
    if(typeof(onClick)==="function"||!deviceConfig||!deviceConfig.name||!device||!device.DeviceValue||disabled||device.status==="offline")return;
    setValue(device.DeviceValue[deviceConfig.name])
  },[device,onClick,data,deviceConfig,disabled])

const changeHandler = (event)=>{
  setValue(event.target.value)

  if(!data||!device)
    return
  return outValue(device.DeviceId,event.target.value)
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

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("")
    let arr1 = newstr.split(",")
    return arr1
  }

  return(
    <label className={`EnumElement ${className} ${(disabled2)?"disabled":""}`}>
      <div className="icon-conteiner">
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
        <div className="icon-box-enum">
          <div className="icon">
            <div className="circle">
            {
              (itemField()&&itemField().icon)?
              <i className={itemField().icon}></i>:
              <i className="fas fa-circle-notch"></i>
            }
            </div>
          </div>
          {
            (deviceConfig&&deviceConfig.values)?
            <select value={value} onChange={changeHandler}>
            {
              valuesDecod(deviceConfig.values).map((item,index)=>{
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })
            }
            </select>
            :null
          }
        </div>
        <p>{title}</p>
      </div>

    </label>
  )
}
