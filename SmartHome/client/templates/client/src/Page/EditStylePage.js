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
    setStyle({...style, [event.target.name]:event.target.value})
  }
  const opasityHandler = (event)=>{
    setStyle1({...style, [event.target.name]:event.target.checked})
    setStyle({...style, [event.target.name]:event.target.checked})
  }

  const out = ()=>{
    setStyle(getColors(styles,config.Style))
    history.goBack();

  }

  const createStyle = async() =>{
    if(!style.name)
      return message("name empty", "error");
    await request(`/api/user/style/add`, 'POST', style,{Authorization: `Bearer ${auth.token}`})
    updateConfig()
    out()
  }

  return(
    <>
    <HomePage/>
    <div className="backGlass" onClick={out}></div>
    <div className="editStylePanel">
      <div className="colors">
        <div className="boxFieldColor">
          <div className="colorfield">
            <p>color 1</p>
            <input type="color" value={style?.c1} name="c1" onChange={colorHandler}/>
          </div>
          <div className="opasityfield">
            <p>opasity</p>
            <input type="checkbox" checked={style?.opasiryc1} name="opasiryc1" onChange={opasityHandler}/>
          </div>
        </div>
        <div className="boxFieldColor">
          <div className="colorfield">
            <p>color 2</p>
            <input type="color" value={style?.c2} name="c2" onChange={colorHandler}/>
          </div>
          <div className="opasityfield">
            <p>opasity</p>
            <input type="checkbox" checked={style?.opasiryc2} name="opasiryc2" onChange={opasityHandler}/>
          </div>
        </div>
        <div className="boxFieldColor">
          <div className="colorfield">
            <p>color 3</p>
            <input type="color" value={style?.c3} name="c3" onChange={colorHandler}/>
          </div>
          <div className="opasityfield">
            <p>opasity</p>
            <input type="checkbox" checked={style?.opasiryc3} name="opasiryc3" onChange={opasityHandler}/>
          </div>
        </div>
        <div className="boxFieldColor">
          <div className="colorfield">
            <p>color active</p>
            <input type="color" value={style?.active} name="active" onChange={colorHandler}/>
          </div>
          <div className="opasityfield">
            <p>opasity</p>
            <input type="checkbox" checked={style?.opasiryActive} name="opasiryActive" onChange={opasityHandler}/>
          </div>
        </div>
        <div className="boxFieldColor">
          <div className="colorfield">
            <p>color ok</p>
            <input type="color" value={style?.ok} name="ok" onChange={colorHandler}/>
          </div>
          <div className="opasityfield">
            <p>opasity</p>
            <input type="checkbox" checked={style?.opasiryOk} name="opasiryOk" onChange={opasityHandler}/>
          </div>
        </div>
      </div>
      <div className="nameField">
        <input type="text" value={style?.name} placeholder="name" name="name" onChange={colorHandler}/>
        <button onClick={createStyle}>create</button>
      </div>
    </div>
    </>
  )
}
