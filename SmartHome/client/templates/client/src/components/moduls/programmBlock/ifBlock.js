import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {AddScriptContext} from '../../addScript/addScriptContext'
import {ValueDeviceBlock} from './valueDeviceBlock'
import {TextBlock} from './textBlock'
import {NumberBlock} from './numberBlock'
import {MathBlock} from './mathBlock'
// import {ifClass} from '../../../myClass.js'

export const IfBlock = ({idDevice,updata,index,data,el,deleteEl})=>{
  const [device, setDevice]=useState({})
  const {devices} = useContext(DeviceStatusContext)
  const {show} = useContext(AddScriptContext)
  const [type,setType] = useState(data.action??"power")
  const [action,setAction] = useState(data.oper??"==")
  const [blockData/*, setData*/] = useState(data)
  const [allTypes,setAllTypes] = useState([])


  const lookForDeviceById = useCallback((id)=>{
    let condidat = devices.filter((item)=>item.DeviceId===id)
    condidat = condidat[0]
    let array = []
    if(condidat){
      for (var item of condidat.DeviceConfig) {
        array.push(item.name)
      }
    }
    setAllTypes(array)
    return condidat;
  },[devices])

  useEffect(()=>{
    setDevice(lookForDeviceById(idDevice))
  },[lookForDeviceById,idDevice])

const updataValue = (data1)=>{
  let element = data
  let val = element.value
  if(blockData.value.type==="device"){
    val = {...val, action:data1.action}
  }
  if(blockData.value.type==="text"){
    val = {...val, value:data1.action}
  }
  if(blockData.value.type==="number"){
    val = {...val, value:data1.action}
  }
  if(blockData.value.type==="math"){
    val = data1
  }
  element.value = val
  console.log(element.value);
  updata(element,index)
}

const addvalue = ()=>{
  show("addValue",(typeValue,deviceData)=>{
    console.log(typeValue,deviceData);
    let element = data
    if(typeValue==="deviceBlock"){
      let action = "power"
      if(deviceData.DeviceType==="dimmer"){
        action = "dimmer"
      }
      if(deviceData.DeviceType==="variable"){
        action = "value"
      }
      if(deviceData.DeviceType==="sensor"||deviceData.DeviceType==="binarySensor"||deviceData.DeviceType==="other"){
        action = "value"
      }
      element = {...element, value:{type:"device",idDevice:deviceData.DeviceId,action:action}}
    }
    if(typeValue==="Text"){
      element = {...element, value:{type:"text",value:""}}
    }
    if(typeValue==="Number"){
      element = {...element, value:{type:"number",value:0}}
    }
    if(typeValue==="Math"){
      element = {...element, value:{type:"math",value1:null,value2:null,action:"+"}}
    }
    updata(element,index)
  })
}

const deleteValue = ()=>{
  let element = data
  element = {...element, value:null}
  updata(element,index)
}

const changeSelector = event=>{
  let element = data
  if(event.target.name==="type"){
    setType(event.target.value)
    element = {...element, action:event.target.value}
  }
  else if(event.target.name==="action") {
    setAction(event.target.value)
    element = {...element, oper:event.target.value}
  }
  updata(element,index)
}

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        {(device)?device.DeviceName:"Name"}
      </div>
      <div className="programm-function-block-content-item">
        <select value={type} onChange={changeSelector} name="type">
          {
            allTypes.map((item,index)=>{
              return(
                <option key={index} value={item}>{item}</option>
              )
            })
          }
        </select>
      </div>
      <div className="programm-function-block-content-item">
      <select value={action} onChange={changeSelector} name="action">
        {
          (type==="power")?
          <>
            <option value="==">==</option>
            <option value="!=">!=</option>
          </>:
          <>
            <option value="==">==</option>
            <option value="!=">!=</option>
            <option value=">=">{">="}</option>
            <option value="<=">{"<="}</option>
            <option value=">">{">"}</option>
            <option value="<">{"<"}</option>
          </>
        }
      </select>
      </div>
      <div className="programm-function-block-conteiner-item">
      {
        (!blockData.value)?
        <div className="programm-function-block-content-item add" onClick={()=>{addvalue()}}>
          <i className="fas fa-plus"></i>
        </div>:
        (blockData.value.type==="device")?
        <ValueDeviceBlock deviceId={blockData.value.idDevice} action={blockData.value.action} updata={updataValue} deleteEl={deleteValue}/>:
        (blockData.value.type==="text")?
        <TextBlock action={blockData.value.value} updata={updataValue} deleteEl={deleteValue}/>:
        (blockData.value.type==="number")?
        <NumberBlock action={blockData.value.value} updata={updataValue} deleteEl={deleteValue}/>:
        (blockData.value.type==="math")?
        <MathBlock data={blockData.value} action={blockData.value.value} updata={updataValue} deleteEl={deleteValue}/>:
        null
      }
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
