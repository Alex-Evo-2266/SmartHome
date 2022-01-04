import React,{useState,useContext,useRef,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {AuthContext} from '../../../context/AuthContext.js'
import {RunText} from '../../runText'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const SliderElement = ({index,title,data,min=0,max=100,disabled=false,firstValue=0,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const [value , setValue] = useState(firstValue)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const delay = useRef(null)
  const [disabled2, setDisabled] = useState(disabled)
  const [device, setDevice] = useState({})
  const [minstate, setMin] = useState(0)
  const [maxstate, setMax] = useState(100)
  const {target} = useContext(CartEditContext)

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0]||!data)
      return false
    let condidat = devices.filter((item)=>item&&item.systemName===id)
    if(!condidat[0]) return null
    let conf = null
    for (var item of condidat[0].config) {
      if(item.name===data.typeAction){
        conf = item
      }
    }
    if(!conf)
      setDisabled(true)
    setMin(conf?.low)
    setMax(conf?.high)
    return condidat[0]
  },[devices,data])

  const outValue = async(v)=>{
    await request('/api/device/value/set', 'POST', {systemName: data.deviceName,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(!data||!data.deviceName||typeof(onClick)==="function"){
      setMin(min)
      setMax(max)
      return
    }
    setDevice(lookForDeviceById(data.deviceName))
  },[devices,data,onClick,lookForDeviceById,min,max])

  useEffect(()=>{
    if(!disabled&&device&&device.status){
      if(device.status==="online"){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
      return
    }
    if(!disabled&&!devices.length) {
      setDisabled(true)
    }else if(!disabled&&devices.length) {
      setDisabled(false)
    }
  },[device,disabled,devices])

  useEffect(()=>{
    if(typeof(onClick)==="function")return
    if(!device||!device.value)return
    setValue(Number(device.value[data.typeAction]))
  },[device,onClick,data])

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
      target("button",{...data,index},editBtn)
    }
  }

// if(!device){
//   return null
// }

return(
  <div className="slider-box">
    <RunText className="name RunTextBaseColor" id={title} text={title}/>
    <div className="slider">
      <input
      type="range"
      min={minstate||0}
      max={maxstate||100}
      value={value||0}
      onChange={changeHandler}
      onInput={changeHandler}
      disabled={disabled2}
      />
    </div>
    <div className="value">{value||0}</div>
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
  </div>
)
}
