import React,{useEffect,useState,useCallback,useContext} from 'react'
import {StyleContext} from './StyleContext'
import {UserContext} from '../../context/UserContext'
import {ServerConfigContext} from '../../context/ServerConfigContext'
import {SocketContext} from '../../context/SocketContext'
import {useHttp} from '../../hooks/http.hook'
import {useCastomStyle} from '../../hooks/style.hook'

export const CastomizeStyle = ({children, token, ready}) =>{
  const {request, error, clearError} = useHttp();
  const {message} = useContext(SocketContext)
  const [config, setConfig] = useState({})
  const [serverConfig, setServerConfig] = useState({})
  const [styles, setStyles] = useState([])
  const [flag, setFlag] = useState(false)
  const {setStyle, avtoNightStyle, adaptiveBackground, setBackground} = useCastomStyle()

  const getColors = useCallback((styles, name)=>{
    try {
      for (var item of styles) {
        if(name === item.name)
          return item
      }
    } catch{
      return
    }
  },[])

  const getimage = (images, name)=>{
    try {
      for (var item of images) {
        if(name === item.type)
          return item
      }
    } catch{
      return
    }
  }

  const getData = useCallback(async()=>{
    const dataStyles = await request(`/api/style/all`, 'GET', null,{Authorization: `Bearer ${token}`})
    const dataUserConf = await request(`/api/user/config/get`, 'GET', null,{Authorization: `Bearer ${token}`})
    setStyles(dataStyles)
    setConfig(dataUserConf)
    return {dataStyles, dataUserConf}
  },[request,token])

  const applicationStyle = useCallback((data)=>{
    const style = getColors(data?.dataStyles, data?.dataUserConf?.Style)
    if(!data?.dataUserConf?.staticBackground)
      adaptiveBackground(data?.dataUserConf?.images)
    else
      setBackground(getimage(data?.dataUserConf?.images, "base")?.image)
    if(data?.dataUserConf?.auteStyle)
      avtoNightStyle(style, getColors(data?.dataStyles, "night"))
    else
      setStyle(style)
  },[avtoNightStyle, setBackground, adaptiveBackground, getColors, setStyle])

  const updataStyle = useCallback(async() => {
    if(!token)
    {
      console.error("no authtorization");
      setBackground()
      setStyle()
      return
    }
    const data = await getData()
    applicationStyle(data)
  },[token,getData,applicationStyle,setStyle,setBackground])

  const update = ()=>{
    setFlag(true);
    setTimeout(function () {
      setFlag(false);
    }, 400);
  }

  useEffect(()=>{
    if(ready || flag){
      updataStyle()
    }
  },[ready,updataStyle, flag])

  useEffect(()=>{
    if(error)
      console.error(error);
    return ()=>{
      clearError();
    }
  },[error, clearError])

  useEffect(()=>{
    if(message.type==="server"){
      setServerConfig(message.data)
      applicationStyle({dataStyles:styles, dataUserConf:config})
    }
  },[message,applicationStyle,styles,config])

  return(
    <UserContext.Provider value={{...config,getData}}>
      <ServerConfigContext.Provider value={{...serverConfig}}>
        <StyleContext.Provider value={{styles:styles,updateConfig:update}}>
          {children}
        </StyleContext.Provider>
      </ServerConfigContext.Provider>
    </UserContext.Provider>
  )
}
