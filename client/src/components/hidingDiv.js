import React, {useCallback, useEffect, useRef, useState} from 'react'

export const HidingDiv = ({children, title, show=false})=>{
  const [visible, setVisible] = useState(show)
  const [height, setHeight] = useState("56px")
  const container = useRef(null)

  const togle = useCallback((event)=>{
    if(event.target.className.split(" ")[0]!=="hiding-div"&&event.target.parentNode.className.split(" ")[0]!=="hiding-div") return;
    {
      if (visible){
        setHeight("56px")
      }
      else
      {
        let height2 = window.getComputedStyle(container.current).getPropertyValue('height')
        height2 = Number(height2.slice(0, -2))
        setHeight((height2 + 15 + 56) + "px")
      }
      setVisible(!visible)
    }
  },[visible])

  return(
    <div style={{maxHeight: height}} name = "hiding-div" className={`hiding-div card-container ${(visible)?"show":"hide"}`} onClick={togle}>
      <h3 value = "hiding-div" className="hiding-div-title">{title}</h3>
      <i value = "hiding-div" className="hiding-div-icon fas fa-chevron-down"></i>
      <div ref={container} className="hiding-div-content">
        {children}
      </div>
    </div>
  )
}
