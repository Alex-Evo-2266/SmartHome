import React from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import {UserOption} from '../components/pages/optionPages/userOption'
import {ServerOption} from '../components/pages/optionPages/serverOption'
import {ImgOption} from '../components/pages/optionPages/imgOption'
import {MenuOption} from '../components/pages/optionPages/menuOption'

export const OptionsPage = () => {
  const location = useLocation();

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
          <ul className = "page-nav">
            <li className = {(location.pathname==="/config")?"active":""} title="user config">
              <NavLink to = "/config" exact >
                <i className="fas fa-user"></i>
              </NavLink>
            </li>
            <li className = {(location.pathname==="/config/server")?"active":""} title="server config">
              <NavLink to = "/config/server" >
                <i className="fas fa-server"></i>
              </NavLink>
            </li>
            <li className = {(location.pathname==="/config/image")?"active":""} title="background config">
              <NavLink to = "/config/image" >
                <i className="fas fa-image"></i>
              </NavLink>
            </li>
            <li className = {(location.pathname==="/config/menu")?"active":""} title="menu config">
              <NavLink to = "/config/menu" >
                <i className="fas fa-icons"></i>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
  )
}
