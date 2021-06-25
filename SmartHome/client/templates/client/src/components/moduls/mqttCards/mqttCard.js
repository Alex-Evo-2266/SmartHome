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
    type:"text",

  },
  state:{
    min:"0",
    max:"1",
    icon:"",
    type:"boolean"
  },
  brightness:{
    min:"0",
    max:"100",
    icon:'',
    type:"range"
  },
  color:{
    min:"1600",
    max:"3600",
    icon:"",
    type:"range",
  },
  temp:{
    min:"0",
    max:"40",
    icon:"",
    type:"range",
  },
  mode:{
    min:"0",
    max:"2",
    icon:'',
    type:"number"
  }
}


export const MQTTElement = ({data}) =>{
  const form = useContext(FormContext)

  function dictToList(dict) {
    let arr = []
    console.log(dict);
    for (var key in dict) {
      let val = dict[key]
      if(typeof(dict[key])==="object"||typeof(dict[key])==="boolean"){
        val = JSON.stringify(val)
      }
      if(val.length>100){
        val = "..."
      }
      arr.push({name:key,value:val})
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
    if(typeof(mes)==="boolean"){
      mes = JSON.stringify(mes)
    }
    let topicComponents = data.topic.split('/')
    let field = topicComponents.pop()
    message = [{name:field,value:mes}]
  }

  function Decice() {
    let devices = []
    if(data.lincs){
      for (var item of data.lincs) {
        let dev = item.device
        let field
        if(dev.DeviceValueType!=="json" && item.field){
          field = item.field.name
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
      for (var item of message) {
        let ctype = baseAddressList[item.name]
        if(!ctype)
          ctype = item.name
        let cMinMax = baseMinMax[ctype]
        if(!cMinMax){
          cMinMax = baseMinMax["base"]
        }
        let caddress = item.name
        let clow = cMinMax.min
        let chigh = cMinMax.max
        let cicon = cMinMax.icon
        typeControl = cMinMax.type||typeControl
        let confel = {
          name:ctype,
          address:caddress,
          low:clow,
          high:chigh,
          icon:cicon||"",
          type:typeControl,
          control:(ret!=="sensor")
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
          return <p className="mqttMessageStr" key={index}>{item.name}: {item.value}</p>
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
