import React,{useState,useContext,useRef,useEffect} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {AuthContext} from '../../../context/AuthContext.js'
import {RunText} from '../../runText'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const SliderElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{
  const auth = useContext(AuthContext)
  const [value , setValue] = useState(0)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const delay = useRef(null)
  const {target} = useContext(CartEditContext)

  const outValue = async(v)=>{
    await request(`/api/${data.data.typeItem}/value/set`, 'POST', {systemName: data.data.deviceName ,type:data.data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(typeof(onClick)==="function")return
    if(!data?.fieldvalue)return
    setValue(Number(data?.fieldvalue))
  },[onClick,data])

  const changeHandler = (event)=>{
    setValue(event.target.value)
    if(delay.current){
      clearTimeout(delay.current)
    }
    delay.current = setTimeout(function () {
      outValue(event.target.value)
    }, 200);
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

return(
  <div className="slider-box">
    <RunText className="name RunTextBaseColor" id={data.title} text={data.title}/>
    <div className="slider">
      <input
      type="range"
      min={data.field?.low||0}
      max={data.field?.high||100}
      value={value||0}
      onChange={changeHandler}
      onInput={changeHandler}
      disabled={data.disabled}
      />
    </div>
    <div className="value">{value||0}</div>
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
  </div>
)
}
