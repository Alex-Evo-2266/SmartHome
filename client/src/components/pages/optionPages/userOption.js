import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {Loader} from '../../Loader'
import {StyleIcon} from './castomIcon/styleIcon'
import {StyleContext} from '../../UserStyle/StyleContext'
import {Menu} from '../../Menu/dopmenu/menu'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const UserOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)
  const history = useHistory()
  const {styles, updateConfig} = useContext(StyleContext)

  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [mode , setMode] = useState(false)
  const [userconf , setUserconf] = useState({
    auteStyle:config.auteStyle||false,
    staticBackground:config.staticBackground||false,
    style:config.Style||"light"
  });

  const updataConf = useCallback(async()=>{
    if(!config)return;
    setUserconf({
      auteStyle:config.auteStyle||false,
      staticBackground:config.staticBackground||false,
      style:config.Style||"light",
    })
  },[config])

  const userConfigHandler = async()=>{
    await request(`/api/user/config/edit`, 'POST', userconf,{Authorization: `Bearer ${auth.token}`})
    updateConfig()
    setTimeout(()=>{
      updataConf()
    },500)
  }

  const deleteStyle = async (event)=>{
    await request(`/api/style/delete`, 'POST', {name:event.target.dataset.name}, {Authorization: `Bearer ${auth.token}`})
    updateConfig();
    setTimeout(()=>{
      updataConf()
    },500)
  }
  
  useEffect(()=>{
    updataConf();
  },[updataConf])

  const styleHandler = async(event)=>{
    setUserconf({ ...userconf, style:event.target.dataset.name })
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
      <div className="dividers"></div>
      <div className="configElement block">
        <p className="switchText">Style</p>
        <Menu buttons={[
          {
            title:"create",
            onClick:()=>history.push("/config/style")
          },
          {
            title:"detete",
            onClick:()=>setMode(!mode)
          }
        ]}/>
        <div className="StyleChoice">
          {
            styles?.map((item, index)=>{
              return(
                <div
                key={index}
                onClick={(mode && (item.name !== "light" && item.name !== "night"))?deleteStyle:styleHandler}
                className={`choiceElement ${(mode && (item.name !== "light" && item.name !== "night"))?"deleted":""} ${(userconf.style===item.name)?"active":null}`}
                data-name={item.name}>
                  <StyleIcon colors={item}/>
                  <p className="styleName">{item.name}</p>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="dividers"></div>
      <div className="configElement block">
        <button style={{width: "100%"}} className="normalSelection button" onClick={userConfigHandler}>Save</button>
      </div>
    </div>
)
}
