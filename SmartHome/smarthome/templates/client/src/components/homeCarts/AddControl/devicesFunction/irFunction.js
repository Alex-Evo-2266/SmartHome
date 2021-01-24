import React, {useState} from 'react'

export const IrFunction = ({type,device,result})=>{

  const [value, setValue] = useState("");

  const out=()=>{
    if(!value){
      let el = document.getElementById('command')
      el.style="background:red;"
      return
    }
    result({
      item:type,
      type:"ir",
      order:"0",
      address:device.DeviceConfig.command,
      IdDevice:device.DeviceId,
      name:device.DeviceName,
      value:value})
  }

    return(
      <div className="deviceFunctionConteiner">
      {
        (device.DeviceConfig&&device.DeviceConfig.power&&type==="button")?
        <div className="deviceFunctionItem">
          <p>power</p>
          <input id="command" type="text" className="command" value={value} onChange={(event)=>setValue(event.target.value)}/>
          <input type="button" value="Ok" onClick={out}/>
        </div>
        :null
      }
      </div>
    )
}
