import React,{useState,useContext,useEffect} from 'react'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const EnumElement = ({children, data, onClick, index, deleteBtn, editBtn, className}) =>{
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(data.fieldvalue)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(v)=>{
    await request(`/api/${data.data.typeItem}/value/set`, 'POST', {systemName: data.data.deviceName,type:data.data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    if(typeof(onClick)==="function"||!data.fieldvalue||data.disabled||data.entity?.status==="offline")return;
    setValue(data.fieldvalue)
  },[data.fieldvalue, onClick, data.disabled, data.entity?.status])

const changeHandler = (event)=>{
  setValue(event.target.value)
  return outValue(event.target.value)
}

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("")
    let arr1 = newstr.split(",")
    return arr1
  }
  return(
    <BaseElement deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
      <div className="icon">
        <div className="circle">
          <i className={data.field?.icon||"fas fa-circle-notch"}></i>
        </div>
      </div>
        <p className="name">{data.title}</p>

        {
          (data.field?.values)?
          <select value={value} onChange={changeHandler} disabled={data.disabled}>
          {
            valuesDecod(data.field?.values).map((item,index2)=>{
              return(
                <option key={index2} value={item}>{item}</option>
              )
            })
          }
          </select>
          :null
        }
    </BaseElement>
  )
}
