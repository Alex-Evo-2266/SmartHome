import React,{useEffect} from 'react'
import {RunText} from '../runText'

export const SelectioEnlementImg = ({width="90px", height="80px", name, title, onClick,src,active = false})=>{

  return(
    <div style={{width,height}} title={name} className={`selectioEnlementImg ${(active)?"active":""}`} onClick={onClick}>
      <img alt={`interfese ${name}`} src={src}/>
      <RunText id={name} text={title} className="info"/>
    </div>
  )
}
