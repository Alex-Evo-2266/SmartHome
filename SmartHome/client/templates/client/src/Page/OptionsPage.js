import React from 'react'
import {NavLink, useLocation} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {UserOption} from '../components/pages/optionPages/userOption'
import {ServerOption} from '../components/pages/optionPages/serverOption'
import {ImgOption} from '../components/pages/optionPages/imgOption'
import {MenuOption} from '../components/pages/optionPages/menuOption'

export const OptionsPage = () => {
  const location = useLocation();

  return(
    <div className = "conteiner top bottom">
      <Header name="Device All">
        <NavLink to = "/config" className="btn" exact >
          <i className="fas fa-user"></i>
        </NavLink>
        <NavLink to = "/config/server" className="btn">
          <i className="fas fa-server"></i>
        </NavLink>
        <NavLink to = "/config/image" className="btn">
          <i className="fas fa-image"></i>
        </NavLink>
        <NavLink to = "/config/menu" className="btn">
          <i className="fas fa-icons"></i>
        </NavLink>
      </Header>
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
