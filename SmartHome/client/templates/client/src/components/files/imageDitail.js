import React,{useEffect,useState,useContext} from 'react'
import {BackForm} from '../moduls/backForm'
import {AuthContext} from '../../context/AuthContext.js'
import {UserContext} from '../../context/UserContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'

export const ImageDitail = ({data,hide})=>{
  const [fon,setFon]=useState("base")
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)
  const {updateBackground} = useContext(UserContext)

  const changeSelector = (event)=>{
    setFon(event.target.value)
  }

  const out = async()=>{
    await request(`/api/background/set`, 'POST', {id:data.id,type:fon},{Authorization: `Bearer ${auth.token}`})
    updateBackground()
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
          <select value={fon} onChange={changeSelector}>
            <option value="base">Base</option>
            <option value="sunrise">Sunrise</option>
            <option value="day">Day</option>
            <option value="twilight">Twilight</option>
            <option value="night">Night</option>
          </select>
          <button className="button primary" onClick={out}>Cделать фоном</button>
        </div>
      </div>
    </BackForm>
  )
}