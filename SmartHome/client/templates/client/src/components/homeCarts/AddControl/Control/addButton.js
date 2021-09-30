import React, {useContext,useState,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../../context/SocketContext'

function filtred(data) {
  let condidats = data.filter(item=>item.DeviceType!=="sensor")
  let filtredData = []
  for (var item of condidats) {
    for (var item2 of item.DeviceConfig) {
      if(item2.control){
        filtredData.push(item)
        break
      }
    }
  }
  return filtredData
}

function filtredField(data) {
  let filtredData = []
  for (var item of data) {
    if(item.control){
      filtredData.push(item)
    }
  }
  return filtredData
}

export const AddButton = ({add})=>{
  const {devices} = useContext(SocketContext)
  const [allDevices] = useState(filtred(devices));
  const [device, setDevice] = useState({});
  const [deviceConfig, setDeviceConfig] = useState({})
  const [buttonForm, setButtonForm] = useState({
    id:null,
    name:"",
    type:"button",
    typeAction:"",
    order:"0",
    deviceId:null,
    action:"",
    width:1,
    height:1
  })

  const up = (steploc=1)=>{
    let n = Number(buttonForm.action)
    if(n>=Number(deviceConfig.max))
      return setButtonForm({...buttonForm,action:deviceConfig.max})
    if(n+steploc>Number(deviceConfig.max))
      return setButtonForm({...buttonForm,action:deviceConfig.max})
    return setButtonForm({...buttonForm,action:n+steploc})
  }
  const down = (steploc=1)=>{
    let n = Number(buttonForm.action)
    if(n<=Number(deviceConfig.min))
      return setButtonForm({...buttonForm,action:deviceConfig.min})
    if(n-steploc<Number(deviceConfig.min))
      return setButtonForm({...buttonForm,action:deviceConfig.min})
    return setButtonForm({...buttonForm,action:n-steploc})
  }

  useEffect(()=>{
    if(device){
      setButtonForm({id:null,
        name:device.DeviceName,
        type:"button",
        typeAction:"",
        order:0,
        deviceId:device.DeviceId,
        action:"",
        width:1,
        height:1
      })
    }
  },[device])

  // useEffect(()=>{
  //   setDevices
  // },[allDevices])

  const itemField = useCallback(()=>{
    if(!device||!device.DeviceConfig||!buttonForm.typeAction)return
    for (var item of device.DeviceConfig) {
      if(item.name===buttonForm.typeAction){
        console.log("data",item);
        return item
      }
    }
  },[buttonForm.typeAction,device])

  useEffect(()=>{
    let item = itemField()
    if(!device||!device.DeviceConfig||!item)return
    const {low} = item
    if(item.type === "number"){
      setButtonForm((prev)=>{return{...prev,action:low}})
      return setDeviceConfig({min:low,max:item.high})
    }
    // if(item.type === "number"){
    //   setButtonForm((prev)=>{return{...prev,action:0}})
    //   return setDeviceConfig({min:0,max:item.high-1})
    // }
    return
  },[device,buttonForm.typeAction,itemField])

  const outaction = ()=>{
    add(buttonForm)
  }

  const out = (type)=>{
    setButtonForm({...buttonForm,typeAction:type})
    add({...buttonForm,typeAction:type})
  }

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("");
    let arr1 = newstr.split(",")
    return arr1
  }

  if(!device||!device.DeviceId){
    return(
      <ul>
        {
          allDevices.map((item,index)=>{
            return(
              <li key={index} onClick={()=>setDevice(item)}><span>{index+1}</span>{item.DeviceName}</li>
            )
          })
        }
      </ul>
    )
  }
  if (!buttonForm.typeAction) {
    return(
      <ul>
      {
        filtredField(device.DeviceConfig).map((item,index)=>{
          if(item.type==="number"&&item.name==="mode"&&device.DeviceType!=="other"){
            return(
              <div key={index}>
                <li onClick={()=>setButtonForm({...buttonForm,typeAction:"mode"})}>mode</li>
                <li onClick={()=>out("modeTarget")}>target mode</li>
              </div>
            )
          }
          return(
            <li key={index} onClick={()=>{
              if(item.type==="binary")
                out(item.name)
              else if(device.DeviceType==="variable")
                setButtonForm({...buttonForm,typeAction:"variable"})
              else
                setButtonForm({...buttonForm,typeAction:item.name})
            }}>{item.name}</li>
          )
        })
      }
      </ul>
    )
  }
  if (itemField()&&itemField().type==="text"&&buttonForm.typeAction) {
    return(
      <ul>
        <li className="noAnim">
          <input value={buttonForm.action} onChange={(event)=>setButtonForm({...buttonForm,action:event.target.value})}/>
          <button onClick={outaction}>Ok</button>
        </li>
      </ul>
    )
  }
  if(buttonForm.typeAction==="variable"){
    return(
      <ul>
        <li className="noAnim">
          <input value={buttonForm.action} onChange={(event)=>setButtonForm({...buttonForm,action:event.target.value})}/>
          <button onClick={outaction}>Ok</button>
        </li>
      </ul>
    )
  }
  if(itemField()&&itemField().type==="enum"&&buttonForm.typeAction){
    if(!buttonForm.action){
      setButtonForm({...buttonForm,action:"targetField"})
    }
    return(
      <ul>
        <li className="noAnim">
          <select name="" value={buttonForm.action} onChange={(event)=>setButtonForm({...buttonForm,action:event.target.value})}>
          <option value="targetField">targetField</option>
          {
            valuesDecod(itemField().values).map((item,index)=>{
              return(
                <option key={index} value={item}>{item}</option>
              )
            })
          }
          </select>
          <button onClick={outaction}>Ok</button>
        </li>
      </ul>
    )
  }
  if(deviceConfig){
    return(
      <ul>
        <li className="noAnim">
          <div className = "InputNumber">
            <input type="text" readOnly value={buttonForm.action}/>
            <div className="InputNumber-btnConteiner">
              <div className="InputNumber-btnDown" onClick={()=>down(1)}><i className="fas fa-angle-left"></i></div>
              <div className="InputNumber-btnUp" onClick={()=>up(1)}><i className="fas fa-angle-right"></i></div>
            </div>
            <div className="InputNumber-btnConteiner">
              <div className="InputNumber-btnDown" onClick={()=>down(10)}><i className="fas fa-angle-double-left"></i></div>
              <div className="InputNumber-btnUp" onClick={()=>up(10)}><i className="fas fa-angle-double-right"></i></div>
            </div>
          </div>
          <button onClick={outaction}>Ok</button>
        </li>
      </ul>
    )
  }

  return (
    <ul>
    </ul>
  )
}
