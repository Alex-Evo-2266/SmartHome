import React,{useContext,useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {BaseElement} from './BaseElement'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const ScriptElement = ({data,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,switchMode=true,deleteBtn}) =>{
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const clickHandler = async()=>{
    await request(`/api/script/run/${data.deviceId}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  return(
    <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
      <div onClick={clickHandler}>
        <div className="icon"></div>
        <p className="name">{data.name}</p>
      </div>
    </BaseElement>
  )
}
