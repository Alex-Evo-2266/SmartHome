import React, {useContext,useState,useEffect} from 'react'
import {FormContext} from '../Form/formContext'
import {RunText} from '../runText'
import {Power} from './newDeviceControlElements/power'
import {Dimmer} from './newDeviceControlElements/dimmer'
import {Mode} from './newDeviceControlElements/mode'
import {Color} from './newDeviceControlElements/color'
import {DeviceStatusContext} from '../../context/DeviceStatusContext'

export const NewDeviceElement = ({id}) =>{
  const {devices, updateDevice} = useContext(DeviceStatusContext)
  const form = useContext(FormContext)
  const [device,setDevice] = useState({})

  useEffect(()=>{
    if(devices){
      let newdev = devices.filter(item => (item&&item.DeviceId===id))[0]
      setDevice(newdev)
    }
  },[devices,id])

  if(!device){
    return null
  }

  function dictToList(dict) {
    let arr = []
    for (var key in dict) {
      arr.push({type:key,value:dict[key]})
    }
    return arr
  }

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect ${device.DeviceTypeConnect||"other"}`}>
          <p>{device.DeviceTypeConnect||"other"}</p>
        </div>
        <RunText className="DeviceName" id={device.DeviceSystemName} text={device.DeviceName||"NuN"}/>
      </div>
      <div className = "NewCardBody">
        <ul>
        {
          ((device.DeviceType==="sensor"||device.DeviceType==="other")&&device.DeviceValue&&device.DeviceValue)?
          dictToList(device.DeviceValue).map((item,index)=>{
            return(
              <li className="DeviceControlLi" key={index}>
                <div className="DeviceControlLiName">
                  <p>{item.type}</p>
                </div>
                <div className="DeviceControlLiContent">
                  <div className="DeviceControlLiValue">
                    <p>{item.value}</p>
                  </div>
                </div>
              </li>
            )
          })
          :null
        }
        {
          (device.DeviceTypeConnect==="system"&&device.DeviceType==="variable"&&device.DeviceValue&&device.DeviceValue.value)?
          <li className="DeviceControlLi">
            <div className="DeviceControlLiName">
              <p>Value</p>
            </div>
            <div className="DeviceControlLiContent">
              <div className="DeviceControlLiValue">
                <p>{device.DeviceValue.value}</p>
              </div>
            </div>
          </li>
          :null
        }
        {
          (device.status==="offline")?
          <li className="DeviceControlLi"><h4 className="offline">offline</h4></li>
          :<>
          {
            (device.DeviceControl&&device.DeviceControl.power)?
            <Power updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue&&(device.DeviceValue.power==="on"||device.DeviceValue.power==="1"))?1:0} type="power"/>:null
          }
          {
            (device.DeviceControl&&device.DeviceControl.dimmer)?
            <Dimmer updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?Number(device.DeviceValue.dimmer):0} type="dimmer" title = "brightness" conf={device.DeviceControl.dimmer}/>:null
          }
          {
            (device.DeviceControl&&device.DeviceControl.temp)?
            <Dimmer updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?Number(device.DeviceValue.temp):0} type="temp" title = "light temp" conf={device.DeviceControl.temp}/>:null
          }
          {
            (device.DeviceControl&&device.DeviceControl.color)?
            <Color updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?Number(device.DeviceValue.color):0} type="color"/>:null
          }
          {
            (device.DeviceControl&&device.DeviceControl.mode)?
            <Mode updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue)?Number(device.DeviceValue.mode):0} type="mode" conf={Number(device.DeviceControl.mode)}/>:null
          }
          </>
        }
        </ul>
      </div>
      <div className = "NewCardControl">
        <button className="cardControlBtn" onClick={()=>{form.show("EditDevices",updateDevice,device)}}>edit</button>
      </div>
    </div>
  )
}
