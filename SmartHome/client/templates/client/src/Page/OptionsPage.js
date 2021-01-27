import React,{useContext} from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {UserOption} from '../components/pages/optionPages/userOption'
import {ServerOption} from '../components/pages/optionPages/serverOption'
import {ImgOption} from '../components/pages/optionPages/imgOption'
import {UsersOption} from '../components/pages/optionPages/usersOption'

export const OptionsPage = () => {
  const auth = useContext(AuthContext)
  const location = useLocation();

  return(
    <div className = "conteiner">
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
          <div className = {`page ${(location.pathname==="/config/users")?"active":""}`}>
            <UsersOption/>
          </div>
          <ul className = "page-nav">
            <li className = {(location.pathname==="/config")?"active":""}>
              <NavLink to = "/config" exact >
                <i className="fas fa-user"></i>
              </NavLink>
            </li>
            <li className = {(location.pathname==="/config/server")?"active":""}>
              <NavLink to = "/config/server" >
                <i className="fas fa-server"></i>
              </NavLink>
            </li>
            <li className = {(location.pathname==="/config/image")?"active":""}>
              <NavLink to = "/config/image" >
                <i className="fas fa-image"></i>
              </NavLink>
            </li>
            {
              (auth.userLevel===3)?
              <li className = {(location.pathname==="/config/users")?"active":""}>
                <NavLink to = "/config/users" >
                  <i className="fas fa-users-cog"></i>
                </NavLink>
              </li>
              :null
            }
          </ul>
        </div>
      </div>
  )
}
