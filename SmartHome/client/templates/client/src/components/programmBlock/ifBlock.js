import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../context/SocketContext'
import {AddScriptContext} from '../addScript/addScriptContext'
import {ValueDeviceBlock} from './valueDeviceBlock'
import {TextBlock} from './textBlock'
import {NumberBlock} from './numberBlock'
import {EnumBlock} from './enumBlock'
import {MathBlock} from './mathBlock'
// import {ifClass} from '../../../myClass.js'

export const IfBlock = ({idDevice,updata,index,data,deleteEl})=>{
  const [device, setDevice]=useState({})
  const {devices} = useContext(SocketContext)
  const {showData} = useContext(AddScriptContext)
  const [action,setAction] = useState(data.oper??"==")
  const [field,setField] = useState({})

  const lookForDeviceById = useCallback((id)=>{
    return devices.filter((item)=>item.DeviceId===id)[0]
  },[devices])

  const lookForField = (device,name)=>{
    return device.DeviceConfig.filter((item)=>item.name===name)[0]
  }

  const valuesDecod = (data)=> data.split(" ").join("").split(",")

  useEffect(()=>{
    console.log("effect",data);
    setDevice(lookForDeviceById(data.idDevice))
    setField(lookForField(lookForDeviceById(data.idDevice),data.action))
  },[lookForDeviceById,data])

  const changeSelector = (event)=>{
    let element = {...data, [event.target.name]:event.target.value}
    if(event.target.name==="action")
      setField(lookForField(lookForDeviceById(data.idDevice),element.action))
    if(event.target.name==="oper")
      setAction(element.oper)
    updata(element,index)
  }

  const addvalue = ()=>{
    showData("addValue",{type:field.type},(typeValue,deviceData)=>{
      let element = data
      if(typeValue==="deviceBlock")
        element = {...element, value:{type:"device",idDevice:deviceData.DeviceId,action:deviceData.DeviceConfig[0].name}}
      if(typeValue==="Text")
        element = {...element, value:{type:"text",value:""}}
      if(typeValue==="Number")
        element = {...element, value:{type:"number",value:0}}
      if(typeValue==="Math")
        element = {...element, value:{type:"math",value1:null,value2:null,action:"+"}}
      if(typeValue==="Enum"&&field.type==="binary")
        element = {...element, value:{type:"enum",value:"low"}}
      if(typeValue==="Enum"&&field.type==="enum")
        element = {...element, value:{type:"enum",value:valuesDecod(field.values)[0]}}
      updata(element,index)
    })
  }

const updataValue = (data1)=>{
  let element = data
  let val = element.value
  if(data.value.type==="device")
    val = {...val, action:data1.action}
  if(data.value.type==="text")
    val = {...val, value:data1.action}
  if(data.value.type==="number")
    val = {...val, value:data1.action}
  if(data.value.type==="enum")
    val = {...val, value:data1.action}
  if(data.value.type==="math")
    val = data1
  element.value = val
  updata(element,index)
}

const deleteValue = ()=>{
  let element = {...data, value:null}
  updata(element,index)
}

if(Object.keys(device)?.length === 0 || Object.keys(field)?.length === 0){
  return null
}
  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        {(device)?device.DeviceName:"Name"}
      </div>
      <div className="programm-function-block-content-item">
        <select value={field.name} onChange={changeSelector} name="action">
          {
            device.DeviceConfig.map((item,index)=>{
              return(
                <option key={index} value={item.name}>{item.name}</option>
              )
            })
          }
        </select>
      </div>
      <div className="programm-function-block-content-item">
      <select value={action} onChange={changeSelector} name="oper">
        <option value="==">==</option>
        <option value="!=">!=</option>
        {
          (field.type==="number")?
          <>
            <option value=">=">{">="}</option>
            <option value="<=">{"<="}</option>
            <option value=">">{">"}</option>
            <option value="<">{"<"}</option>
          </>:null
        }
      </select>
      </div>
      <div className="programm-function-block-conteiner-item">
      {
        (!data.value)?
        <div className="programm-function-block-content-item add" onClick={addvalue}>
          <i className="fas fa-plus"></i>
        </div>:
        (data.value.type==="device")?
        <ValueDeviceBlock data={data.value} type={field.type} updata={updataValue} deleteEl={deleteValue}/>:
        (data.value.type==="text")?
        <TextBlock data={data.value} updata={updataValue} deleteEl={deleteValue}/>:
        (data.value.type==="number")?
        <NumberBlock data={data.value} updata={updataValue} deleteEl={deleteValue}/>:
        (data.value.type==="math")?
        <MathBlock data={data.value} updata={updataValue} deleteEl={deleteValue}/>:
        (data.value.type==="enum"&&field.type==="enum")?
        <EnumBlock data={data.value} values={valuesDecod(field.values)} updata={updataValue} deleteEl={deleteValue}/>:
        (data.value.type==="enum"&&field.type==="binary")?
        <EnumBlock data={data.value} values={["high","low","togle"]} updata={updataValue} deleteEl={deleteValue}/>:
        null
      }
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
