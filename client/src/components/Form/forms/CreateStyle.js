import React,{useState,useContext,useEffect} from 'react'
import {StyleIcon} from '../../pages/optionPages/castomIcon/styleIcon'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const CreateStyle = ({hide})=>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [style, setStyle] = useState({
    name: '',
    c1: "#303030",
    c2: "#505050",
    c3: "#707070"
  })

  const colorHandler = (event)=>{
    setStyle({...style, [event.target.name]:event.target.value})
  }

  const createStyle = async() =>{
    if(!style.name)
      return message("name empty", "error");
    await request(`/api/user/style/add`, 'POST', style,{Authorization: `Bearer ${auth.token}`})
    hide();
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <div className="form">
      <div className="content">
        <StyleIcon colors = {style}/>
        <div className="control">
        <input type="text" value={style.name} name="name" onChange={colorHandler}/>
          <input type="color" value={style.c1} name="c1" onChange={colorHandler}/>
          <input type="color" value={style.c2} name="c2" onChange={colorHandler}/>
          <input type="color" value={style.c3} name="c3" onChange={colorHandler}/>
        </div>
        <button onClick={createStyle}>Create</button>
      </div>
    </div>
  )
}
