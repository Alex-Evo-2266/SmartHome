import React, {useContext,useState,useEffect,useCallback, useRef} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {NavLink,useHistory} from 'react-router-dom'
import {Menu as DopMenu} from '../../dopmenu/menu'

export const LeftSubMenu = ({visible ,buttons})=>{
  const auth = useContext(AuthContext)
  const history = useHistory()

  return(
    <>
    <div className="subMenuArrow" style={(visible)?{transform:"rotate(180deg)"}:null}>
      <i class="fas fa-chevron-up"></i>
    </div>
    <div className={`submenu ${(visible)?"show":"hide"}`}>
      <ul>
        {
          (Array.isArray(buttons))?buttons.map((item, index)=>{
            return(
              <li className={`submenuElement ${(item.action)?"active":""}`} key={index}>
                <p onClick={item.active}>{item.title}</p>
                <span onClick={item.dop?.active}><i className={item.dop?.iconClass}></i></span>
              </li>
            )
          })
          :null
        }
      </ul>
    </div>
    </>
  )
}
