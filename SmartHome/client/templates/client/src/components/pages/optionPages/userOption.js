import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {Loader} from '../../Loader'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import lightStyle from '../../../img/lightstyle.png'
import nightStyle from '../../../img/nightstyle.png'
import gibridStyle from '../../../img/gibridstyle.png'

export const UserOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)

  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [userconf , setUserconf] = useState({
    auteStyle:false,
    staticBackground:false,
    style:"light"
  });

  const updataConf = useCallback(async()=>{
    if(!config)return;
    setUserconf({
      auteStyle:config.auteStyle||false,
      staticBackground:config.staticBackground||false,
      style:config.Style||"light",
    })
  },[config])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  const userConfigHandler = async()=>{
    await request(`/api/user/config/edit`, 'POST', userconf,{Authorization: `Bearer ${auth.token}`})
    window.location.reload();
  }

  const styleHandler = async(event)=>{
    setUserconf({ ...userconf, style:event.target.name })
  }

  const checkedHandler = event => {
    setUserconf({ ...userconf, [event.target.name]: event.target.checked })
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
      <div className="configElement">
        <p className="text">Style</p>
        <div className="configElement choice">
          <img alt="style night" src={nightStyle} className={`choice ${(userconf.style==="night")?"active":null}`} name="night" onClick={styleHandler}/>
          <img alt="style gibrid" src={gibridStyle} className={`choice ${(userconf.style==="gibrid")?"active":null}`} name="gibrid" onClick={styleHandler}/>
          <img alt="style light" src={lightStyle} className={`choice ${(userconf.style==="light")?"active":null}`} name="light" onClick={styleHandler}/>
        </div>
      </div>
      <button onClick={userConfigHandler}>Save</button>
    </div>
)
}
