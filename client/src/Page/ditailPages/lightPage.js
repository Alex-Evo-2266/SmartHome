import React,{useContext, useState, useEffect, useRef} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useMessage} from '../../hooks/message.hook'
import {getValue} from './components/utils'
import {Slider} from './components/slider'
import {Text} from './components/text'
import {Enum} from './components/enum'

export const LightPage = ({device})=>{
  const auth = useContext(AuthContext)
  const [value,setValue] = useState(false)
  const blub = useRef(null)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const getBlub = (fields)=>fields?.filter((item)=>(item?.type === "binary" && item?.control === true && (item?.name?.toLowerCase()?.indexOf("state") !== -1 || item?.name?.toLowerCase()?.indexOf("power") !== -1)))

  const otherBinary = (fields)=>fields?.filter((item)=>(item?.type === "binary" && item?.control === true && item?.name?.toLowerCase()?.indexOf("state") === -1 && item?.name?.toLowerCase()?.indexOf("power") === -1))

  const textcontrol = (fields)=>fields?.filter((item)=>(item?.type === "text" && item?.control === true))

  const enumcontrol = (fields)=>fields?.filter((item)=>(item?.type === "enum" && item?.control === true))

  const sensors = (fields)=>fields?.filter((item)=>(item?.control === false))

  const generalBlub = (fields)=>{
    let blubs = getBlub(fields)||[]
    let blubs2 = blubs.filter((item)=>(item?.name?.toLowerCase()?.indexOf("state") === 0 || item?.name?.toLowerCase()?.indexOf("power") === 0))
    if(blubs2.length > 0)
      return blubs2[0]
    if(blubs.length > 0)
      return blubs[0]
    return null
  }

  const dopBlub = (fields)=>{
    let blubs = getBlub(fields)
    let blub = generalBlub(fields)
    return blubs.filter((item)=>item.name !== blub.name)
  }

  const ranges = (fields)=>fields.filter((item)=>item.type === "number")

  const outValue = async(systemName,name,v)=>{
    await request('/api/device/value/set', 'POST', {systemName: systemName,type:name,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const togleField = (name)=>{
    let val = device.value[name]
    outValue(device.systemName, name, (val==="1")?0:1)
  }

  useEffect(()=>{
    let d = getValue(device, "state")
    setValue(d)
  },[device])

  useEffect(()=>{
    blub.current?.style.setProperty('--blub-on',"#fff")
  },[])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <div className="deviceContainer">
      <div className="top-left"></div>
      <div className="topContainer top-center">
        <p className="lightName">{device?.name}</p>
        {
          [generalBlub(device.config)]?.map((item,index)=>{
            return(
            <div key={index}>
              <div className="blubContainer">
                <div onClick={()=>togleField(item.name)} ref={blub} className={`bulb ${(value)?"on":"off"}`}>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <p className="nameGeneralBlub">{item.name}</p>
            </div>
            )
          })
        }
      </div>
      <div className="top-right"></div>
      {
        (ranges(device.config).length !== 0)?
        <div className="containerBlock">
          {
            ranges(device.config).map((item, index)=>{
              return (
                <div key={index} className="slider-container">
                  <Slider device={device} item={item}/>
                </div>
              )
            })
          }
        </div>:
        null
      }
      {
        (dopBlub(device.config).length !== 0)?
        <div className="containerBlock dopBlubContainer">
          {
            dopBlub(device.config).map((item, index)=>{
              return (
                <div onClick={()=>togleField(item.name)} key={index} className={`dopBlubButton ${(getValue(device,item.name))?"activ":""}`}>
                  <i className={item.icon||"far fa-lightbulb"}></i>
                </div>
              )
            })
          }
        </div>:
        null
      }
      {
        (otherBinary(device.config).length !== 0)?
        <div className="containerBlock dopBlubContainer">
          {
            otherBinary(device.config).map((item, index)=>{
              return (
                <div onClick={()=>togleField(item.name)} key={index} className={`dopBlubButton ${(getValue(device,item.name))?"activ":""}`}>
                  <i className={item.icon||"fas fa-power-off"}></i>
                </div>
              )
            })
          }
        </div>:
        null
      }
      {
        (textcontrol(device.config).length !== 0)?
        <div className="containerBlock">
          {
            textcontrol(device.config).map((item, index)=>{
              return (
                <div key={index} className="text-container">
                  <Text device={device} item={item}/>
                </div>
              )
            })
          }
        </div>:
        null
      }
      {
        (textcontrol(device.config).length !== 0)?
        <div className="containerBlock">
          {
            enumcontrol(device.config).map((item, index)=>{
              return (
                <div key={index} className="text-container">
                  <Enum device={device} item={item}/>
                </div>
              )
            })
          }
        </div>:
        null
      }
      {
        (sensors(device.config).length !== 0)?
        <div className="containerBlock">
          {
            sensors(device.config).map((item, index)=>{
              return (
                <div key={index} className="text-container">
                  <div className="sensor-container">
                    <p className="name">{item.name}</p>
                    <p className="value">{String(getValue(device,item.name))}</p>
                  </div>
                </div>
              )
            })
          }
        </div>:
        null
      }
    </div>
  )
}
