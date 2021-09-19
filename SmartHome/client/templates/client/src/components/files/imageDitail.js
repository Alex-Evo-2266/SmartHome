import React,{useEffect,useState,useContext} from 'react'
import {BackForm} from '../moduls/backForm'
import {AuthContext} from '../../context/AuthContext.js'
import {StyleContext} from '../UserStyle/StyleContext'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'

export const ImageDitail = ({data,hide})=>{
  const [fon,setFon]=useState("base")
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)
  const {styles, updateConfig} = useContext(StyleContext)


  const changeSelector = (event)=>{
    setFon(event.target.value)
  }

  const out = async()=>{
    await request(`/api/background/set`, 'POST', {id:data.id,type:fon},{Authorization: `Bearer ${auth.token}`})
    updateConfig()
    hide()
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return (
    <BackForm onClick={hide} className="ditailImage-body">
      <div className="ditailImage-box">
        <div className="ditailImage-image">
          <img src={data.image} alt={data.title}/>
        </div>
        <div className="ditailImage-control">
          <p>Name: {data.title}</p>
          <div className="dividers"></div>
          <div className="input-data">
          <select value={fon} onChange={changeSelector}>
            <option value="base">Base</option>
            <option value="sunrise">Sunrise</option>
            <option value="day">Day</option>
            <option value="twilight">Twilight</option>
            <option value="night">Night</option>
          </select>
          </div>
          <button className="button normalSelection" onClick={out}>Cделать фоном</button>
        </div>
      </div>
    </BackForm>
  )
}
