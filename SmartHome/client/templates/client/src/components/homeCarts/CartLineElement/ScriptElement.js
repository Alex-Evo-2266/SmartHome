import React,{useContext,useEffect} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
import {BaseElement} from './BaseElement'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const ScriptElement = ({data,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,switchMode=true,deleteBtn}) =>{
  const {target} = useContext(CartEditContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data,index},editBtn)
    }
  }

  const clickHandler = async()=>{
    await request(`/api/script/run/${data.deviceId}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  return(
    <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
      <div className="icon"></div>
      <p className="name">{data.name}</p>
    </BaseElement>
  )
}
