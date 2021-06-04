import React,{useContext} from 'react'
import {FormContext} from '../../Form/formContext'

const baseAddressList = {
  state:"state",
  power:"state",
  dimmer:"brightness",
  brightness:"brightness",
  color: "color",
  temp: "temp",
  color_temp: "temp",
  mode: "mode"
}
const baseMinMax = {
  base:{
    min:"0",
    max:"255",
    icon:'',
    typeControl:"text"
  },
  state:{
    min:"0",
    max:"1",
    icon:"",
    typeControl:"boolean"
  },
  brightness:{
    min:"0",
    max:"100",
    icon:'',
    typeControl:"range"
  },
  color:{
    min:"1600",
    max:"3600",
    icon:"",
    typeControl:"range",
  },
  temp:{
    min:"0",
    max:"40",
    icon:"",
    typeControl:"range",
  },
  mode:{
    min:"0",
    max:"2",
    icon:'',
    typeControl:"number"
  }
}


export const MQTTElement = ({data}) =>{
  const form = useContext(FormContext)

  function dictToList(dict) {
    let arr = []
    for (var key in dict) {
      arr.push({type:key,value:dict[key]})
    }
    return arr
  }

  let message
  let typeMessage = 'value'
  let mes = data.message
  try {
    mes = JSON.parse(mes)
    typeMessage = 'json'
  }catch(e){}
  if(typeof(mes)==="object"){
    message = dictToList(mes)
  }else{
    let topicComponents = data.topic.split('/')
    let field = topicComponents.pop()
    message = [{type:field,value:mes}]
  }

  function Decice() {
    let devices = []
    if(data.lincs){
      for (var item of data.lincs) {
        let dev = item.device
        let field
        if(dev.DeviceValueType!=="json" && item.field){
          field = item.field.type
        }
        devices.push(`${dev.DeviceSystemName}${(field)?`.${field}`:''}`)
      }
      return devices
    }
    return []
  }

  function lincDecice() {
    form.show("ChoiceType",(ret)=>{
      let topicComponents = data.topic.split('/')
      if(topicComponents[topicComponents.length-1]==="set")
        topicComponents.pop()
      if(typeMessage==="value"){
        topicComponents.pop()
      }
      let address = topicComponents.join('/')
      let conf = []
      let typeControl = "text"
      if(ret==="sensor"){
        typeControl = "sensor"
      }
      for (var item of message) {
        let ctype = baseAddressList[item.type]
        if(!ctype)
          ctype = item.type
        let cMinMax = baseMinMax[ctype]
        if(!cMinMax){
          cMinMax = baseMinMax["base"]
        }
        let caddress = item.type
        let clow = cMinMax.min
        let chigh = cMinMax.max
        let cicon = cMinMax.icon
        typeControl = cMinMax.typeControl||typeControl
        let confel = {
          type:ctype,
          address:caddress,
          low:clow,
          high:chigh,
          icon:cicon||"",
          typeControl:typeControl
        }
        conf.push(confel)
      }
      form.show("LinkDevices",null,{
        DeviceTypeConnect: "mqtt",
        DeviceType: ret,
        DeviceAddress: address,
        DeviceValueType: typeMessage,
        DeviceConfig: conf
      })
    })
  }

  return(
    <>
      <td>{data.topic}</td>
      <td>{
        message.map((item,index)=>{
          return <p className="mqttMessageStr" key={index}>{item.type}: {item.value}</p>
        })
      }</td>
      <td>{
        (!Decice()||!Decice()[0])?
        "NuN":
        Decice().map((item,index)=>{
          return <p className="mqttMessageStr" key={index}>{item}</p>
        })
      }</td>
      <td><button onClick={lincDecice}>связать</button></td>
    </>
  )
}
