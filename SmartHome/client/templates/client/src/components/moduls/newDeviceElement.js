import React, {useContext,useState} from 'react'
import {FormContext} from '../Form/formContext'
import {RunText} from '../runText'

export const NewDeviceElement = (props) =>{
  const form = useContext(FormContext)
  const [control, setControl] = useState([])

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect ${props.DeviceTypeConnect||"other"}`}>
          <p>{props.DeviceTypeConnect||"other"}</p>
        </div>
        <RunText className="DeviceName" id={props.DeviceSystemName} text={props.DeviceName||"NuN"}/>
      </div>
      <div className = "NewCardBody">
        {
          (props.DeviceType==="light")
        }
      </div>
      <div className = "NewCardControl">
        <button className="cardControlBtn" onClick={()=>{form.show("EditDevices",props.updataDevice,props.DeviceId)}}>edit</button>
      </div>
    </div>
  )
}
