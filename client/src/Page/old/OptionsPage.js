import React, {useContext,useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import {UserOption} from '../components/pages/optionPages/userOption'
import {ServerOption} from '../components/pages/optionPages/serverOption'
import {ImgOption} from '../components/pages/optionPages/imgOption'
import {AuthContext} from '../context/AuthContext.js'
import {MenuContext} from '../components/Menu/menuContext'
import {MenuOption} from '../components/pages/optionPages/menuOption'

export const OptionsPage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {setData} = useContext(MenuContext)
  const location = useLocation();

  useEffect(()=>{
    let buttons = [
      {
        title:"user",
        action:()=>history.push("/config"),
        active:(location.pathname==="/config")
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
    ]
    if(auth.userLevel >= 3)
      buttons.push({
        title:"server",
        action:()=>history.push("/config/server"),
        active:(location.pathname==="/config/server")
      })
    setData("Setings",{
      buttons:buttons
    })
  },[setData,location.pathname, history, auth.userLevel])

  return(
    <div className = "fullScrinContainer color-normal page-whith-tabs">
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
