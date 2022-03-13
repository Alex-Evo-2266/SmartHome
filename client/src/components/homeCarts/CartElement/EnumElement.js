import React,{useState,useContext,useEffect} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const EnumElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{
  const auth = useContext(AuthContext)
  const [value, setValue]=useState("")
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const {target} = useContext(CartEditContext)

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(id,v)=>{
    await request(`/api/${data.data.typeItem}/value/set`, 'POST', {systemName: id,type:data.data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    if(typeof(onClick)==="function"||!data.fieldvalue||data.disabled)return;
    setValue(data.fieldvalue)
  },[onClick,data.fieldvalue,data.disabled])

const changeHandler = (event)=>{
  setValue(event.target.value)

  if(!data?.entity||!data?.data)
    return
  return outValue(data.entity.systemName,event.target.value)
}

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data.data,index},editBtn)
    }
  }

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("")
    let arr1 = newstr.split(",")
    return arr1
  }

  return(
    <label className={`EnumElement ${className} ${(data.disabled)?"disabled":""}`}>
      <div className="icon-conteiner">
      {
        (data.editmode&&(deleteBtn || editBtn))?
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
        <div className="icon-box-enum">
          <div className="icon">
            <div className="circle">
              <i className={data.field?.icon||"fas fa-circle-notch"}></i>
            </div>
          </div>
          {
            (data.field?.values)?
            <select value={value} onChange={changeHandler}>
            {
              valuesDecod(data.field.values).map((item,index)=>{
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })
            }
            </select>
            :null
          }
        </div>
        <p>{data.title}</p>
      </div>

    </label>
  )
}
