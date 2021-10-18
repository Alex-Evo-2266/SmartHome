import React, {useContext,useState,useEffect,useCallback, useRef} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {NavLink,useHistory} from 'react-router-dom'
import {Menu as DopMenu} from '../../dopmenu/menu'

export const BottomMenu = ({hide, togle, visible, insluedField, controlButtons, otherField})=>{
  const auth = useContext(AuthContext)
  const bottomMenuRef = useRef(null)
  const history = useHistory()

  const closeMenu = ()=>{
    if(bottomMenuRef.current){
      bottomMenuRef.current.scrollTop = 0
    }
    hide()
  }

  return(
    <>
    <div onClick={closeMenu} ref={bottomMenuRef} className={`bottomMenuAll ${(visible)?"show":""}`}>
      <div style={{height:"50vh", weight:"100%"}}></div>
      <ul className="baseMenu">
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
    </div>
    <div className="bottomMenu">
      <div className="burger" onClick={togle}>
        <i className="fas fa-bars"></i>
      </div>
      <div className="item">
        <NavLink to = "/home">
          <i className="fas fa-home"></i>
        </NavLink>
      </div>
      <div className="controlConteiner">
      {
        (controlButtons?.search)?
        <div className="search" onClick={controlButtons.search.togle}>
          <i className="fas fa-search"></i>
        </div>:
        null
      }
      {
        (controlButtons?.dopmenu)?
          <DopMenu className="bottom" buttons={controlButtons.dopmenu}/>
        :null
      }
      </div>
    </div>
    </>
  )
}
