import React, {useContext,useState,useEffect} from 'react'
import {FormContext} from '../Form/formContext'
import {RunText} from '../runText'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {Power} from './newDeviceControlElements/power'
import {Dimmer} from './newDeviceControlElements/dimmer'
import {Mode} from './newDeviceControlElements/mode'
import {Enum} from './newDeviceControlElements/enum'
import {Menu} from '../dopmenu/menu'
// import {Color} from './newDeviceControlElements/color'
import {DeviceStatusContext} from '../../context/DeviceStatusContext'
import {AuthContext} from '../../context/AuthContext.js'

export const NewDeviceElement = ({id}) =>{
  const {devices, updateDevice} = useContext(DeviceStatusContext)
  const form = useContext(FormContext)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [device,setDevice] = useState({})
  const [status,setStatus] = useState(false)

  useEffect(()=>{
    if(devices){
      let newdev = devices.filter(item => (item&&item.DeviceId===id))[0]
      setDevice(newdev)
      if(newdev)
        setStatus(newdev.DeviceStatus)
    }
  },[devices,id])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  if(!device){
    return null
  }

  const linc = ()=>{
    setStatus((prev)=>!prev)
    request('/api/devices/status/set', 'POST', {id: device.DeviceId,status:!status},{Authorization: `Bearer ${auth.token}`})
  }

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect ${device.DeviceTypeConnect||"other"}`}>
          <p>{device.DeviceTypeConnect||"other"}</p>
        </div>
        <RunText className="DeviceName" id={device.DeviceSystemName} text={device.DeviceName||"NuN"}/>
        <Menu buttons={[
          {
            title:"edit",
            active:()=>{form.show("EditDevices",updateDevice,device)}
          },
          {
            title:(device.DeviceStatus)?"unlinc":"linc",
            active:linc
          }
        ]}/>
      </div>
      <div className="dividers"></div>
      <div className = "NewCardBody">
        <ul>
        {
          (device.status!=="online")?
          <li className="DeviceControlLi"><h4 className="offline">{device.status}</h4></li>
          :device.DeviceConfig.map((item,index)=>{
            if(item.type==="binary" && item.control){
              return <Power key={index} updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue&&(device.DeviceValue[item.name]==="1"))?1:0} type={item.name}/>
            }
            if(item.type==="number"&& item.control){
              return <Dimmer key={index} updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?Number(device.DeviceValue[item.name]):0} type={item.name} title = {item.name} conf={{min:item.low,max:item.high}}/>
            }
            if(item.type==="number"&& item.control){
              return <Mode key={index} updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?Number(device.DeviceValue[item.name]):0} type={item.name} conf={Number(item.high)}/>
            }
            if(item.type==="enum"&& item.control){
              return <Enum key={index} updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?device.DeviceValue[item.name]:0} type={item.name} conf={item.values}/>
            }
            if(item.type==="text"&& item.control){
              return(
                <li className="DeviceControlLi" key={index}>
                  <div className="DeviceControlLiName">
                    <p>{item.name}</p>
                  </div>
                  <div className="DeviceControlLiContent">
                    <div className="DeviceControlLiValue">
                      <p>{device.DeviceValue[item.name]}</p>
                    </div>
                  </div>
                </li>
              )
            }
            if(!item.control){
              return(
                <li className="DeviceControlLi" key={index}>
                  <div className="DeviceControlLiName">
                    <p>{item.name}</p>
                  </div>
                  <div className="DeviceControlLiContent">
                    <div className="DeviceControlLiValue">
                      <p>{device.DeviceValue[item.name]}</p>
                    </div>
                  </div>
                </li>
              )
            }
            return null
          })
        }
        </ul>
      </div>
    </div>
  )
}
