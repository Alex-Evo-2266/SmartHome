import React, {useContext} from 'react'
import {FormContext} from '../Form/formContext'
import {RunText} from '../runText'
import {Power} from './newDeviceControlElements/power'
import {Dimmer} from './newDeviceControlElements/dimmer'
import {Mode} from './newDeviceControlElements/mode'
import {Color} from './newDeviceControlElements/color'

export const NewDeviceElement = (props) =>{
  const form = useContext(FormContext)

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect ${props.DeviceTypeConnect||"other"}`}>
          <p>{props.DeviceTypeConnect||"other"}</p>
        </div>
        <RunText className="DeviceName" id={props.DeviceSystemName} text={props.DeviceName||"NuN"}/>
      </div>
      <div className = "NewCardBody">
        <ul>
        {
          (props.DeviceControl.power)?
          <Power idDevice={props.DeviceId} value={(props.Devicevalue.power==="on")?1:0} type="power"/>:null
        }
        {
          (props.DeviceControl.dimmer)?
          <Dimmer idDevice={props.DeviceId} value={props.Devicevalue.dimmer} type="dimmer" conf={props.DeviceControl.dimmer}/>:null
        }
        {
          (props.DeviceControl.temp)?
          <Dimmer idDevice={props.DeviceId} value={props.Devicevalue.temp} type="temp" conf={props.DeviceControl.temp}/>:null
        }
        {
          (props.DeviceControl.color)?
          <Color idDevice={props.DeviceId} value={props.Devicevalue.color} type="color"/>:null
        }
        {
          (props.DeviceControl.mode)?
          <Mode idDevice={props.DeviceId} value={props.Devicevalue.mode} type="mode" conf={props.DeviceControl.mode}/>:null
        }
        </ul>
      </div>
      <div className = "NewCardControl">
        <button className="cardControlBtn" onClick={()=>{form.show("EditDevices",props.updataDevice,props.DeviceId)}}>edit</button>
      </div>
    </div>
  )
}
