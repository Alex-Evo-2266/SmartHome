import React from 'react'
import {DopMenu} from './dopMenu'
import {Tabs} from './tabs'

export const TopMenu = ({title, togle, buttons, dopmenuBtn, searchTogle})=>{

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
        (searchTogle)?
        <div className="search" onClick={searchTogle}>
          <i className="fas fa-search"></i>
        </div>:
        null
      }
      {
        (dopmenuBtn)?
          <DopMenu buttons={dopmenuBtn}/>
        :null
      }
      </div>
    </div>
  )
}