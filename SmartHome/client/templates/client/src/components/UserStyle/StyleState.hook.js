import React,{useEffect,useState,useCallback} from 'react'
import {StyleContext} from './StyleContext'
import {UserContext} from '../../context/UserContext'
import {ServerConfigContext} from '../../context/ServerConfigContext'
import {useHttp} from '../../hooks/http.hook'
import {useCastomStyle} from '../../hooks/style.hook'

export const CastomizeStyle = ({children, token, ready}) =>{
  const {request, error, clearError} = useHttp();
  const [config, setConfig] = useState({})
  const [serverConfig, setServerConfig] = useState({})
  const [styles, setStyles] = useState([])
  const [flag, setFlag] = useState(false)
  const {setStyle, avtoNightStyle, adaptiveBackground, setBackground} = useCastomStyle()

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
    const dataStyles = await request(`/api/user/styles`, 'GET', null,{Authorization: `Bearer ${token}`})
    const dataUserConf = await request(`/api/user/config`, 'GET', null,{Authorization: `Bearer ${token}`})
    const serverData = await request(`/api/server/data`, 'GET', null,{Authorization: `Bearer ${token}`})
    console.log(dataStyles);
    console.log(serverData);
    console.log(dataUserConf);
    setStyles(dataStyles)
    setConfig(dataUserConf)
    setServerConfig(serverData)
    return {dataStyles, dataUserConf, serverData}
  },[])

  const updataStyle = useCallback(async() => {
    if(!token)
    {
      console.error("no authtorization");
      return
    }
    const data = await getData()
    const style = getColors(data?.dataStyles, data?.dataUserConf?.Style)
    if(!data?.dataUserConf?.staticBackground)
      adaptiveBackground(data?.dataUserConf?.images)
    else
      setBackground(getimage(data?.dataUserConf?.images, "base").image)
    if(data?.dataUserConf?.autoStyle)
      avtoNightStyle(style, getColors(data?.dataStyles, "night"))
    else
      setStyle(style)


  },[token,getData])

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

  return(
    <UserContext.Provider value={{...config}}>
      <ServerConfigContext.Provider value={{...serverConfig}}>
        <StyleContext.Provider value={{styles:styles,updateConfig:update}}>
          {children}
        </StyleContext.Provider>
      </ServerConfigContext.Provider>
    </UserContext.Provider>
  )
}
