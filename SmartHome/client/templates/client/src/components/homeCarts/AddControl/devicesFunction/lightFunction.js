import React, {useState} from 'react'
import {InputNumber} from '../../../moduls/inputNumber'

export const LightFunction = ({type, device,result})=>{

  const [dimmerValue, setDimmerValue] = useState("0");
  const [colorValue, setColorValue] = useState("0");
  const [modeValue, setModeValue] = useState("0");

  const out = (t)=>{
    let base = {
      item:type,
      type:t,
      order:"0",
      IdDevice:device.DeviceId,
      name:device.DeviceName
    }
    if(t==="power"){
      return result({
        ...base,
        address:device.DeviceConfig.power,
        On:device.DeviceConfig.turnOnSignal,
        Off:device.DeviceConfig.turnOffSignal
      })
    }
    if(t==="dimmer"){
      return result({
        ...base,
        address:device.DeviceConfig.dimmer,
        value:(type!=="slider")?dimmerValue:null
      })
    }
    if(t==="mode"){
      return result({
        ...base,
        address:device.DeviceConfig.mode,
        value:modeValue
      })
    }
    if(t==="switch mode"){
      return result({
        ...base,
        address:device.DeviceConfig.mode,
        value:device.DeviceConfig.countMode
      })
    }
    if(t==="color"){
      return result({
        ...base,
        address:device.DeviceConfig.color,
        value:(type!=="slider")?colorValue:null
      })
    }

  }


    return(
      <div className="deviceFunctionConteiner">
        {
          (device.DeviceConfig&&device.DeviceConfig.power&&type==="button")?
          <div className="deviceFunctionItem">
            <p>power</p>
            <input type="button" value="Ok" onClick={()=>out("power")}/>
          </div>:
          null
        }
        {
          (device.DeviceConfig&&device.DeviceConfig.dimmer&&(type==="button"||type==="slider"))?
          <div className="deviceFunctionItem">
            <p>Dimmer</p>
            {
              (type!=="slider")?
              <InputNumber Xten={true} result={(v)=>setDimmerValue(v)} min={device.DeviceConfig.minDimmer} max={device.DeviceConfig.maxDimmer}/>
              :null
            }
            <input type="button" value="Ok" onClick={()=>out("dimmer")}/>
          </div>:null
        }
        {
          (device.DeviceConfig&&device.DeviceConfig.color&&(type==="button"||type==="slider"))?
          <div className="deviceFunctionItem">
            <p>Color</p>
            {
              (type!=="slider")?
              <InputNumber Xten={true} result={(v)=>setColorValue(v)} min={device.DeviceConfig.minColor} max={device.DeviceConfig.maxColor}/>
              :null
            }
            <input type="button" value="Ok" onClick={()=>out("color")}/>
          </div>:null
        }
        {
          (device.DeviceConfig&&device.DeviceConfig.mode&&type==="button")?
          <div className="deviceFunctionItem">
            <p>Mode</p>
            <p>on mode</p>
            <InputNumber Xten={true} result={(v)=>setModeValue(v)} min={0} max={device.DeviceConfig.countMode-1}/>
            <input type="button" value="Ok" onClick={()=>out("mode")}/>
            <p>to switch mode</p>
            <input type="button" value="Ok" onClick={()=>out("switch mode")}/>
          </div>:null
        }
      </div>
    )
}
