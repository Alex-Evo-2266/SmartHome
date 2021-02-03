import React,{useEffect,useState} from 'react'

export const AnimationLi = ({className, children, show=false, poz = "left"})=>{

const [visible, setVisible]=useState(false)

  useEffect(()=>{
    if(show)
      setVisible(true)
    else
      setTimeout(function () {
        setVisible(false)
      }, 1000);
  },[show])

  if(!visible)
    return null

  return(
    <li name = "HidingLi" className={`animationLi ${className} ${poz} ${(show)?"show":"hide"}`}>
      {children}
    </li>
  )
}
