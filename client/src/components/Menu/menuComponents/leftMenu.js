import React, {useContext} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {NavLink} from 'react-router-dom'

export const LeftMenu = ({hide,show, visible, insluedField, otherField, user})=>{
  const auth = useContext(AuthContext)

  const closeMenu=(e)=>{
    let el = e.target.closest("li[data-el=sub]")
    if(!el)
      hide()
  }

  const allclosev = ()=>{
    hide()
  }

  return(
    <>
    {
      (visible)?
      <div className="backGlass" onClick={allclosev} style={{zIndex:96}}></div>
      :null
    }
    <div onClick={closeMenu} className={`navigationRail ${(visible)?"active":""}`}>
    <ul className="baseMenu">
      <li>
        <NavLink to = "/home">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
      </li>
      <li>
        <NavLink to = "/devices">
          <i className="fas fa-plug"></i>
          <span>Devices</span>
        </NavLink>
      </li>
      <li>
        <NavLink to = "/config">
          <i className="fas fa-cogs"></i>
          <span>Options</span>
        </NavLink>
      </li>
      {
        (insluedField)?
        insluedField.map((item,index)=>{
          let t = item.url.indexOf("/")
          return(
            <li key={index}>
            {
              (t!==0)?
              <a href = {item.url}>
                <i className={item.iconClass}></i>
                <span>{item.title}</span>
              </a>:
              <NavLink to = {item.url}>
                <i className={item.iconClass}></i>
                <span>{item.title}</span>
              </NavLink>
            }
            </li>
          )
        }):null
      }
    </ul>
    {
      (visible)?
      <>
      <div className="dividers"></div>
      <ul className="otherMenu">
      {
        (otherField)?
        otherField.map((item,index)=>{
          let t = item.url.indexOf("/")
          return(
            <li key={index}>
            {
              (t!==0)?
              <a href = {item.url}>
                <i className={item.iconClass}></i>
                <span>{item.title}</span>
              </a>:
              <NavLink to = {item.url}>
                <i className={item.iconClass}></i>
                <span>{item.title}</span>
              </NavLink>
            }
            </li>
          )
        }):null
      }
      </ul>
      <div className="dividers"></div>
      <ul className="otherMenu">
        <li>
          <button className="menu-btn" onClick={auth.logout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>logout</span>
          </button>
        </li>
      </ul>
      </>
      :null
    }
    </div>
    </>
  )
}
