import React,{useEffect} from 'react'

export const RunText = ({id, text,className})=>{

  const anim = ()=>{
    let el = document.getElementById(`p-${id}`)
    let el2 = document.getElementById(`div-${id}`)
    if(el.clientWidth >= el2.clientWidth){
      el.className="scroll"
      el.innerHTML=`| ${text} | ${text}`
    }
    else{
      el.className=""
    }
  }
  useEffect(()=>{
    anim()
  },[id])

  return(
    <div id={`div-${id}`} className={`RunText ${className}`}>
      <p id={`p-${id}`}>{text}</p>
    </div>
  )
}
