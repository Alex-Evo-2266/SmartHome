import React, {useState} from 'react'

export const HidingLi = ({children, title, show=false})=>{
  const [visible, setVisible] = useState(show)

  const togle = (event)=>{
    if(event.target.className.split(" ")[0]!=="hidingLi"&&event.target.parentNode.className.split(" ")[0]!=="hidingLi") return;
    setVisible(!visible)
  }

  return(
    <li name = "HidingLi" className={`hidingLi ${(visible)?"show":"hide"}`} onClick={togle}>
      <h3 value = "HidingLi" className="LiTitle">{title}</h3>
      <i value = "HidingLi" className="iconLI fas fa-chevron-down"></i>
      <div className="LiContent">
        {children}
      </div>
    </li>
  )
}
