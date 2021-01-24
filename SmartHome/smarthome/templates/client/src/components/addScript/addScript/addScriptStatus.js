import React from 'react'
import {DeviceValue} from '../../moduls/programmBlock/actBlockElement/DeviseValue'
import {StatusValue} from '../../moduls/programmBlock/actBlockElement/statusValue'
import {TextValue} from '../../moduls/programmBlock/actBlockElement/TextValue'

export const AddScriptStatus = ({result,data})=>{

  const shose = (type)=>{
    result(type)
  }

  return(
    <ul className="IfdeviceList">
      <li className="deviceElement" onClick={()=>shose("value")}>
        <TextValue disabled={true}/>
      </li>
      <li className="deviceElement" onClick={()=>shose("status")}>
        <StatusValue disabled={true}/>
      </li>
      <li className="deviceElement" onClick={()=>shose("DeviseValue")}>
      <DeviceValue disabled={true}/>
      </li>
    </ul>
  )

}
