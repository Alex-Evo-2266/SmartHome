import React,{useContext, useState, useEffect, useCallback, useRef} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useMessage} from '../../hooks/message.hook'
import {getValue} from './components/utils'
import {Slider} from './components/slider'

export const LightPage = ({device})=>{
  const auth = useContext(AuthContext)
  const [value,setValue] = useState(false)
  const blub = useRef(null)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const getBlub = (fields)=>fields?.filter((item)=>(item?.type === "binary" && (item?.name?.toLowerCase()?.indexOf("state") !== -1 || item?.name?.toLowerCase()?.indexOf("power") !== -1)))

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

  const ranges = (fields)=>{
    return fields.filter((item)=>item.type === "number")
  }

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
  },[device, getValue])

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
      <div className="topContainer">
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
        <div className="dividers"></div>
      </div>
      <div className="ditailContainer">
        <div className="leftControl">
          <div className="">
            {
              ranges(device.config).map((item, index)=>{
                return (
                  <Slider device={device} key={index} item={item}/>
                )
              })
            }
            <div className="dividers"></div>
          </div>
        </div>
        <div className="centerControl">
          <div className="">
            {
              dopBlub(device.config).map((item, index)=>{
                return (
                  <div onClick={()=>togleField(item.name)} key={index} className={`dopBlubButton ${(getValue(device,item.name))?"activ":""}`}>
                    <i className={item.icon}></i>
                  </div>
                )
              })
            }
            <div className="dividers"></div>
          </div>
        </div>
        <div className="rightControl"></div>
      </div>
    </div>
  )
}
