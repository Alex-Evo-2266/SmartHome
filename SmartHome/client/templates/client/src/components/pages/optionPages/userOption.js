import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {Loader} from '../../Loader'
import {StyleIcon} from './castomIcon/styleIcon'
import {FormContext} from '../../Form/formContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import lightStyle from '../../../img/lightstyle.png'
import nightStyle from '../../../img/nightstyle.png'
import gibridStyle from '../../../img/gibridstyle.png'

export const UserOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)
  const form = useContext(FormContext)

  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [userconf , setUserconf] = useState({
    auteStyle:false,
    staticBackground:false,
    style:"light"
  });
  const [styles , setStyles] = useState([]);

  const updataConf = useCallback(async()=>{
    if(!config)return;
    setUserconf({
      auteStyle:config.auteStyle||false,
      staticBackground:config.staticBackground||false,
      style:config.Style||"light",
    })
    const data = await request(`/api/user/styles`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setStyles(data)
  },[config])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  const userConfigHandler = async()=>{
    await request(`/api/user/config`, 'PUT', userconf,{Authorization: `Bearer ${auth.token}`})
    setTimeout(function () {
      config.updateBackground()
    }, 200);
  }

  const styleHandler = async(event)=>{
    console.log(event);
    setUserconf({ ...userconf, style:event.target.dataset.name })
  }

  const checkedHandler = event => {
    setUserconf({ ...userconf, [event.target.name]: event.target.checked })
  }

  const createStyle = () => {
    form.show("CreateStyle");
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  if(loading){
    return <Loader/>
  }

  return(
    <div className = "pagecontent">
      <div className="configElement">
        <p className="switchText">changing style when changing time of day</p>
        <label className="switch">
          <input onChange={checkedHandler} name="auteStyle" type="checkbox" checked={userconf.auteStyle}></input>
          <span></span>
          <i className="indicator"></i>
        </label>
      </div>
      <div className="configElement">
        <p className="switchText">static background</p>
        <label className="switch">
          <input onChange={checkedHandler} name="staticBackground" type="checkbox" checked={userconf.staticBackground}></input>
          <span></span>
          <i className="indicator"></i>
        </label>
      </div>
      <div className="configElement block">
        <p className="text">Style</p>
        <div className="StyleChoice">
          <div className={`choiceElement ${(userconf.style==="night")?"active":null}`} data-name="night" onClick={styleHandler}>
            <StyleIcon colors={{c1:"#333", c2:"#555", c3: "#777"}}/>
          </div>
          <div className={`choiceElement ${(userconf.style==="light")?"active":null}`} data-name="light" onClick={styleHandler}>
            <StyleIcon colors={{c1:"#aebfda", c2:"#999", c3: "#ddd"}}/>
          </div>
          {
            styles.map((item)=>{
              return(
                <div className={`choiceElement ${(userconf.style===item.name)?"active":null}`} data-name={item.name} onClick={styleHandler}>
                  <StyleIcon colors={item}/>
                </div>
              )
            })
          }
          <div className="choiceElement" onClick={createStyle}>
            <i class="fas fa-plus"></i>
          </div>
        </div>
      </div>
      <button onClick={userConfigHandler}>Save</button>
    </div>
)
}
