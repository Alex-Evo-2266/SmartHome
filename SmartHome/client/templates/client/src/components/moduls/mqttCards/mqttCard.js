import React,{useContext} from 'react'
import {FormContext} from '../../Form/formContext'

const baseAddressList = {
  state:"power",
  power:"power",
  dimmer:"dimmer",
  brightness:"dimmer",
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
  },
  power:{
    min:"0",
    max:"1",
    icon:"",
  },
  dimmer:{
    min:"0",
    max:"100",
    icon:'',
  },
  color:{
    min:"1600",
    max:"3600",
    icon:"",
  },
  temp:{
    min:"0",
    max:"40",
    icon:"",
  },
  mode:{
    min:"0",
    max:"2",
    icon:''
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

  let mes = data.message
  mes = JSON.parse(mes)
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
      console.log(data.lincs);
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
      let address = topicComponents.join('/')
      let conf = []
      for (var item of message) {
        let ctype = baseAddressList[item.type]
        if(!ctype)
          ctype = item.type
        let cMinMax = baseMinMax[ctype]
        console.log(cMinMax);
        if(!cMinMax){
          cMinMax = baseMinMax["base"]
        }
        let caddress = item.type
        let clow = cMinMax.min
        let chigh = cMinMax.max
        let cicon = cMinMax.icon
        let confel = {
          type:ctype,
          address:caddress,
          low:clow,
          high:chigh,
          icon:cicon||""
        }
        conf.push(confel)
      }
      form.show("LinkDevices",null,{
        DeviceTypeConnect: "mqtt",
        DeviceType: ret,
        DeviceAddress: address,
        DeviceValueType: 'json',
        DeviceConfig: conf
      })
    })
  }

  return(
    <tr>
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
    </tr>
  )
}
