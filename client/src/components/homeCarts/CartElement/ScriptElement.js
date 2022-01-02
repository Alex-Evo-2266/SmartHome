import React,{useContext,useEffect} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
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
    await request(`/api/script/run?name=${data.name}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  return(
    <label className={`ScriptElement ${className}`}>
      <input type="button" onClick={clickHandler} disabled={disabled}/>
      <div className="icon-conteiner">
      {
        (deleteBtn || editBtn)?
        <div className="delete-box">
        {
          (deleteBtn)?
          <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
          null
        }
        {
          (editBtn)?
          <button className="editBtn" onClick={editbtn}>
            <i className="fas fa-list i-cost"></i>
          </button>:
          null
        }
        </div>
        :null
      }
        <div className="icon-box">
          <i className="fas fa-file-alt"></i>
        </div>
        <p>{data.name}</p>
      </div>

    </label>
  )
}
