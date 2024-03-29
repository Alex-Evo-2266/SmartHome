import React from 'react'
import {Menu as DopMenu} from '../dopmenu/menu'
import {Tabs} from './tabs'

export const TopMenu = ({title, togle, buttons, controlButtons})=>{

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
      <Tabs buttons={buttons}/>
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
