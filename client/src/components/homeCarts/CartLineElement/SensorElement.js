import React from 'react'
import {BaseElement} from './BaseElement'

export const SensorElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{

  const getTypeField = ()=>{
    if(!data?.field?.type)return "text"
    return data.field.type
  }

if(!data.entity){
  return null;
}
if(getTypeField()==="text"||getTypeField()==="number"){
  return(
    <BaseElement deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
    <div className="icon">
      <div className="circle">
        <i className={data.field?.icon||"fas fa-circle-notch"}></i>
      </div>
    </div>
        <p className= "sensor-name">{data.title}</p>
        <p className= "state">{`${data.fieldvalue} ${data.field?.unit||""}`}</p>
    </BaseElement>
  )
}
if(getTypeField()==="binary"){
  return(
    <BaseElement deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
    <div className="icon">
      <div className="circle">
        <i className={data.field?.icon||"fas fa-circle-notch"}></i>
      </div>
    </div>
        <p className= "sensor-name">{data.title}</p>
        <div className="control">
          <p className= "state">{`${data.fieldvalue} ${data.field?.unit||""}`}</p>
        </div>
    </BaseElement>
  )
}
return (
  <BaseElement deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
    <div className="icon">
      <div className="circle">
        <i className={data.field?.icon||"fas fa-circle-notch"}></i>
      </div>
    </div>
    <p className= "sensor-name">{data.title}</p>
    <p className= "state">{`${data.fieldvalue} ${data.field?.unit||""}`}</p>
  </BaseElement>
)
}
