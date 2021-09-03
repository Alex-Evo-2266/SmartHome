import React, {useState, useRef} from 'react'

export const Select = ({className, title, children})=>{
  const selectRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const togle = ()=>{
    if(visible)
    {
      selectRef.current.classList.remove("show")
      selectRef.current.classList.add("hide")
      setTimeout(function () {
        selectRef.current.classList.remove("hide")
      }, 1000);
    }
    else
    {
      selectRef.current.classList.add("show")
    }
    setVisible(!visible);
  }

  return(
    <div className={`castomSelect ${className}`}>
      <div className="selectHeader" onClick={togle}>{title}</div>
      <ul ref={selectRef} className={`selectContent`}>
      {children}
      </ul>
    </div>
  )
}
