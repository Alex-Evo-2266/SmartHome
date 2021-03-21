import React, {useContext} from 'react'
import {NavLink,Link} from 'react-router-dom'
import {MenuContext} from './menuContext'
import {AuthContext} from '../../context/AuthContext.js'
import {UserContext} from '../../context/UserContext'
import {AlertContext} from '../alert/alertContext.js'
import {TerminalContext} from '../terminal/terminalContext.js'

export const Menu = ()=>{
  const menu = useContext(MenuContext)
  const config = useContext(UserContext)
  const auth = useContext(AuthContext)
  const terminal = useContext(TerminalContext)
  const {hide} = useContext(AlertContext)
  // const location = useLocation();

  return(
    <>
    <div className = "topMenu">
      <div className="menuTogle" onClick={()=>menu.togle()}>
        <span className = "icon"><i className="fas fa-bars"></i></span>
      </div>
    </div>
    <div className="navigation">
      <nav className={(menu.menu.visible)?"active":""} onClick = {hide}>
        <ul>
          <li onClick = {()=>(menu.menu.visible)?menu.togle():null}>
            <NavLink to = "/home" exact>
              <span className = "icon"><i className="fas fa-home"></i></span>
              <span className = "title">Home</span>
            </NavLink>
          </li>
          <li onClick = {()=>(menu.menu.visible)?menu.togle():null}>
            <NavLink to = "/devices" exact>
              <span className = "icon"><i className="fas fa-plug"></i></span>
              <span className = "title">Devices</span>
            </NavLink>
          </li>
          <li onClick = {()=>(menu.menu.visible)?menu.togle():null}>
            <NavLink to = "/profile">
              <span className = "icon"><i className="fas fa-user-circle"></i></span>
              <span className = "title">Profile</span>
            </NavLink>
          </li>
          <li onClick = {()=>(menu.menu.visible)?menu.togle():null}>
            <NavLink to = "/config">
              <span className = "icon"><i className="fas fa-cog"></i></span>
              <span className = "title">Options</span>
            </NavLink>
          </li>
          {
            (config&&config.MenuElements)?
            config.MenuElements.map((item,index)=>{
              if(item.url==="/terminal"){
                return(
                  <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                    <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
                      <span className = "icon"><i className={item.iconClass}></i></span>
                      <span className = "title">{item.title}</span>
                    </Link>
                  </li>
                )
              }
              return(
                <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                  <NavLink to = {item.url}>
                    <span className = "icon"><i className={item.iconClass}></i></span>
                    <span className = "title">{item.title}</span>
                  </NavLink>
                </li>
              )
            })
            :null
          }
          <li>
            <span className="liinfo">
              <span className = "icon"><i className="fas fa-sort-down"></i></span>
              <span className = "title">Other</span>
            </span>
            <ul>
              <li onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                <NavLink to = "/users">
                  <span className = "icon"><i className="fas fa-users"></i></span>
                  <span className = "title">Users</span>
                </NavLink>
              </li>
              <li onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                <Link to = "#" onClick={auth.logout}>
                  <span className = "icon"><i className="fas fa-sign-out-alt"></i></span>
                  <span className = "title">Logout</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
    </>
  )
}
