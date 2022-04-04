import React,{useContext, useState, useEffect, useRef} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useMessage} from '../../hooks/message.hook'
import {getValue} from './components/utils'
import {Slider} from './components/slider'
import {Text} from './components/text'
import {Enum} from './components/enum'
import {History} from './components/history'
import {Btn} from './components/btn'

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
      <div className="gridDeviceContainer">
      <div className="top-left"></div>
      <div className="topContainer top-center">
        {
          [generalBlub(device.fields)]?.map((item,index)=>{
            if(!item) return (null)
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
        (ranges(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">ranges field</div>
          <div className="containerBlockcontent">
            {
              ranges(device.fields).map((item, index)=>{
                return (
                  <div key={index} className="slider-container">
                    <Slider device={device} item={item}/>
                  </div>
                )
              })
            }
          </div>
        </div>:
        null
      }
      {
        (dopBlub(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">blubs</div>
          <div className="containerBlockcontent dopBlubContainer">
          {
            dopBlub(device.fields).map((item, index)=>{
              return (
                <Btn device={device} key={index} item={item}/>
              )
            })
          }
          </div>
        </div>:
        null
      }
      {
        (otherBinary(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">switchs</div>
          <div className="containerBlockcontent dopBlubContainer">
          {
            otherBinary(device.fields).map((item, index)=>{
              return (
                <Btn device={device} key={index} item={item}/>
              )
            })
          }
          </div>
        </div>:
        null
      }
      {
        (textcontrol(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">text field</div>
          <div className="containerBlockcontent">
          {
            textcontrol(device.fields).map((item, index)=>{
              return (
                <div key={index} className="text-container">
                  <Text device={device} item={item}/>
                </div>
              )
            })
          }
          </div>
        </div>:
        null
      }
      {
        (enumcontrol(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">enum field</div>
          <div className="containerBlockcontent">
            {
              enumcontrol(device.fields).map((item, index)=>{
                return (
                  <div key={index} className="text-container">
                    <Enum device={device} item={item}/>
                  </div>
                )
              })
            }
          </div>
        </div>:
        null
      }
      {
        (sensors(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">sensors field</div>
          <div className="containerBlockcontent">
            {
              sensors(device.fields).map((item, index)=>{
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
          </div>
        </div>:
        null
      }
      </div>
    <div className="HistoryBlock">
      <History device={device}/>
    </div>
    </div>
  )
}
