import React,{useState,useContext} from 'react'
import {UserContext} from '../context/UserContext'
import {StyleContext} from '../components/UserStyle/StyleContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {useCastomStyle} from '../hooks/style.hook'
import {AuthContext} from '../context/AuthContext.js'
import {useHistory} from 'react-router-dom'
import {HomePage} from './HomePage'

const getColors = (styles, name)=>{
  try {
    for (var item of styles) {
      if(name === item.name)
        return item
    }
  } catch{
    return
  }
}

export const EditStylePage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)
  const {styles,updateConfig} = useContext(StyleContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const {setStyle, avtoNightStyle, adaptiveBackground, setBackground} = useCastomStyle()
  const [style, setStyle1] = useState(getColors(styles,config.Style))

  const colorHandler = (event)=>{
    setStyle1({...style, [event.target.name]:event.target.value})
    setStyle(style)
  }

  const createStyle = async() =>{
    if(!style.name)
      return message("name empty", "error");
    await request(`/api/user/style/add`, 'POST', style,{Authorization: `Bearer ${auth.token}`})
    setStyle(getColors(styles,config.Style))
    updateConfig()
    history.goBack();
  }

  return(
    <>
    <HomePage/>
    <div className="backGlass" onClick={()=>history.goBack()}></div>
    <div className="editStylePanel">
      <input type="text" value={style?.name} name="name" onChange={colorHandler}/>
      <input type="color" value={style?.c1} name="c1" onChange={colorHandler}/>
      <input type="color" value={style?.c2} name="c2" onChange={colorHandler}/>
      <input type="color" value={style?.c3} name="c3" onChange={colorHandler}/>
      <button onClick={createStyle}>create</button>
    </div>
    </>
  )
}
