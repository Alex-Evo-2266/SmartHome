import React,{useContext,useEffect,useState,useCallback} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {Loader} from '../../Loader'
import {StyleIcon} from './castomIcon/styleIcon'
import {StyleContext} from '../../UserStyle/StyleContext'
import {FormContext} from '../../Form/formContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import lightStyle from '../../../img/lightstyle.png'
import nightStyle from '../../../img/nightstyle.png'
import gibridStyle from '../../../img/gibridstyle.png'

export const UserOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)
  const {styles, updateConfig} = useContext(StyleContext)
  const form = useContext(FormContext)

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
      auteStyle:config.autoStyle||false,
      staticBackground:config.staticBackground||false,
      style:config.Style||"light",
    })
  },[config])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  const userConfigHandler = async()=>{
    await request(`/api/user/config`, 'PUT', userconf,{Authorization: `Bearer ${auth.token}`})
    updateConfig()
    // setTimeout(function () {
    //
    // }, 200);
  }

  const styleHandler = async(event)=>{
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
          {
            styles?.map((item, index)=>{
              return(
                <div key={index} className={`choiceElement ${(userconf.style===item.name)?"active":null}`} data-name={item.name} onClick={styleHandler}>
                  <StyleIcon colors={item}/>
                </div>
              )
            })
          }
          <Link className="choiceElement" to={"/config/style"}>
            <i className="fas fa-plus"></i>
          </Link>
        </div>
      </div>
      <button onClick={userConfigHandler}>Save</button>
    </div>
)
}
