import React,{useContext,useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {BaseElement} from './BaseElement'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const ScriptElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{
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
    await request(`/api/script/run?name=${data.data.name}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  return(
    <BaseElement onClick={clickHandler} deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
      <div className="icon icon-btn">
        <div className="circle">
          <i className="far fa-file-alt"></i>
        </div>
      </div>
      <p className="name">{data.data.name}</p>
    </BaseElement>
  )
}
