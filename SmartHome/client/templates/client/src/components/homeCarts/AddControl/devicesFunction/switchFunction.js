import React from 'react'

export const SwitchFunction = ({type,device,result})=>{

  const out = ()=>{
    result({
      item:type,
      type:"power",
      order:"0",
      IdDevice:device.DeviceId,
      name:device.DeviceName,
      address:device.DeviceConfig.power,
      On:device.DeviceConfig.turnOnSignal,
      Off:device.DeviceConfig.turnOffSignal
    })
  }

    return(
      <div className="deviceFunctionConteiner">
      {
        (device.DeviceConfig&&device.DeviceConfig.power&&type==="button")?
        <div className="deviceFunctionItem">
          <p>power</p>
          <input type="button" value="Ok" onClick={()=>out()}/>
        </div>
        :null
      }
      </div>
    )
}
