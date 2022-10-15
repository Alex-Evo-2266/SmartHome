import React from 'react'
import {getValue} from './components/utils'
import {Slider} from './components/slider'
import {Text} from './components/text'
import {Enum} from './components/enum'
import {Btn} from './components/btn'
import {History} from './components/history'

export const OtherDevicePage = ({device})=>{

  const binaryControl = (fields)=>fields?.filter((item)=>(item?.type === "binary" && item?.control === true))

  const ranges = (fields)=>fields.filter((item)=>(item.type === "number" && item?.control === true))

  const textcontrol = (fields)=>fields?.filter((item)=>(item?.type === "text" && item?.control === true))

  const enumcontrol = (fields)=>fields?.filter((item)=>(item?.type === "enum" && item?.control === true))

  const sensors = (fields)=>fields?.filter((item)=>(item?.control === false))

  return(
    <div className="deviceContainer">
      <div className="gridDeviceContainer">
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
        (binaryControl(device.fields).length !== 0)?
        <div className="containerBlock">
          <div className="titleBlock">switchs</div>
          <div className="containerBlockcontent dopBlubContainer">
          {
            binaryControl(device.fields).map((item, index)=>{
              return (
                <Btn device={device} item={item}/>
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
