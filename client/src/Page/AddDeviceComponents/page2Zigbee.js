import React,{useContext,useState,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {Loader} from '../../components/Loader'
import {AuthContext} from '../../context/AuthContext.js'
import {SocketContext} from '../../context/SocketContext'

const defVal = {
  voltage:{
    low:0,
    high:10000000
  },
  battery:{
    low:0,
    high:100
  },
  linkquality:{
    low:0,
    high:255
  }
}

export const AddDevicesPage2Zigbee = ({form, setForm, next, backPage}) => {
  const {message} = useMessage();
  const socket = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const {request, error, clearError} = useHttp();
  const [devices, setDevices] = useState([])

  const nextPage = ()=>{
    next()
  }

  const convertForm = (exposes)=>{
    let newArr = []
    for (var item of exposes) {
      if(item.features)
      {
        for (var item2 of item.features) {
          item2.name = item2.endpoint
          item2.control = true
          newArr.push(item2)
        }
      }
      else {
        newArr.push(item)
      }
    }
    return newArr;
  }

  const dupCorrekt = (arr)=>{
    let arr2 = []
    let flag = true
    for (var item of arr) {
      flag = true
      if(item.endpoint && item.endpoint !== item.name)
        item.name = item.name + "_" + item.endpoint
      for (var item2 of arr2) {
        if(item.name === item2)
          flag = false
      }
      if(flag)
        arr2.push(item.name)
      else {
        item.name = item.name + "_" + arr2.indexOf(item.name)
        arr2.push(item.name)
      }
    }
    return arr
  }

  const val = (values=[], def)=>{
    for (var item of values) {
      if(item)
        return item
      if(item === 0)
        return 0
      if(item === false)
        return false
    }
    return def
  }

  const linc = async(dev)=>{
    let conf = []
    for (let item of dupCorrekt(convertForm(dev.exposes))) {
      let type = item.type
      if(item.type==="numeric")
        type="number"
      let values = ""
      if(item.values){
        values = item.values.join(", ")
      }
      let confel = {
        name:item.name,
        address:item.property,
        low:(defVal[item.name]?.low)||val([item.value_min,item.value_off],0),
        high:(defVal[item.name]?.high)||val([item.value_max,item.value_on],100000),
        icon:"fas fa-circle-notch",
        type:type,
        unit:item.unit,
        values:values,
        control:item.endpoint||false
      }
      conf.push(confel)
    }
    await setForm({
      ...form,
      address:dev.root_address.topic + "/" + dev.name,
      fields: conf,
      valueType: "json",
    })
    nextPage()
  }

  useEffect(()=>{
    if(socket.message.type==="newZigbeesDevice")
    {
      setDevices(prev=>{
        let flag = true;
        let arr = prev.map((item)=>{
          if(socket.message.data.friendly_name === item.friendly_name){
            flag = false
            return socket.message.data
          }
          return item
        })
        if(flag)
          arr.push(socket.message.data)
        return arr
      })
    }
  },[socket.message])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    request('/api/module/zigbee2mqtt/permit_join/set', 'POST',{state:true},{Authorization: `Bearer ${auth.token}`})
    return ()=>{
      request('/api/module/zigbee2mqtt/permit_join/set', 'POST',{state:false},{Authorization: `Bearer ${auth.token}`})
    }
  },[request,auth.token])

  return(
    <div className="allFon">
    <div className="infoElement">
      <p>Зажмите кнопку сопряжения на устройстве на 5сек.</p>
    </div>
    <div className="zigbeeDeviceConteiner">
    {
      devices.map((item, index)=>{
        return(
          <div className="zigbeeDevice" key={index} onClick={(item.exposes)?()=>linc(item):()=>{}}>
            <div className="name">name: {item.name}</div>
            <div className="dividers"></div>
            {
              (item.exposes)?
              <>
                <div className="model">model: {item.model}</div>
                <div className="dividers"></div>
                <div className="description">{item.description}</div>
              </>
              :<div className="devLoader"><Loader style={{position:"absolute"}}/></div>
            }
          </div>
        )
      })
    }
    </div>
      <div className="buttons">
        <button style={{marginLeft:"10px"}} className="normalSelection button" onClick={backPage}>Back</button>
      </div>
    </div>
  )
}
