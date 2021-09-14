import React, {useContext,useEffect} from 'react'
import {NavLink, useLocation, useHistory} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {UserOption} from '../components/pages/optionPages/userOption'
import {ServerOption} from '../components/pages/optionPages/serverOption'
import {ImgOption} from '../components/pages/optionPages/imgOption'
import {MenuContext} from '../components/Menu/menuContext'
import {MenuOption} from '../components/pages/optionPages/menuOption'

export const OptionsPage = () => {
  const history = useHistory()
  const {setData} = useContext(MenuContext)
  const location = useLocation();

  useEffect(()=>{
    setData("Options",null,[
      {
        title:"user",
        action:()=>history.push("/config"),
        active:(location.pathname==="/config")
      },
      {
        title:"server",
        action:()=>history.push("/config/server"),
        active:(location.pathname==="/config/server")
      },
      {
        title:"image",
        action:()=>history.push("/config/image"),
        active:(location.pathname==="/config/image")
      },
      {
        title:"menu",
        action:()=>history.push("/config/menu"),
        active:(location.pathname==="/config/menu")
      }
    ])
  },[setData,location.pathname])

  return(
    <div className = "conteiner top bottom">
      <div className = "pages">
        <div className = {`page ${(location.pathname==="/config")?"active":""}`}>
          <UserOption/>
        </div>
        <div className = {`page ${(location.pathname==="/config/server")?"active":""}`}>
          <ServerOption/>
        </div>
        <div className = {`page ${(location.pathname==="/config/image")?"active":""}`}>
          <ImgOption/>
        </div>
        <div className = {`page ${(location.pathname==="/config/menu")?"active":""}`}>
          <MenuOption/>
        </div>
      </div>
    </div>
  )
}
