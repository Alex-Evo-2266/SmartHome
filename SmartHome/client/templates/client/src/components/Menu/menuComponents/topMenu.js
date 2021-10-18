import React, {useContext,useState,useEffect,useCallback, useRef} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {NavLink,useHistory} from 'react-router-dom'
import {Menu as DopMenu} from '../../dopmenu/menu'

export const TopMenu = ({title, togle, buttons, controlButtons})=>{
  const auth = useContext(AuthContext)
  const history = useHistory()

  return(
    <div className="topMenu">
    {
      (togle)?
      <div className="burger" onClick={togle}>
        <i className="fas fa-bars"></i>
      </div>
      :null
    }
      <h2>{title}</h2>
      <div className="tabs">
        {
          buttons?.map((item, index)=>{
            return(
              <div key={index} className={`tabButton ${(item.active)?"active":""}`} onClick={item.action}>{item.title}</div>
            )
          })
        }
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
          <DopMenu buttons={controlButtons.dopmenu}/>
        :null
      }
      </div>
    </div>
  )
}
