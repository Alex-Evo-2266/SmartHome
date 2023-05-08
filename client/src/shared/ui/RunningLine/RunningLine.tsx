import React,{useEffect,useCallback, useRef} from 'react'
import "./runningLine.scss"

interface RunningLineProps{
  text: string
  className?: string
  onClick?:(event:React.MouseEvent<HTMLDivElement>)=>void
  onContextMenu?: (event:React.MouseEvent<HTMLDivElement>)=>void
}

export const RunningLine = ({text, className, onClick, onContextMenu}:RunningLineProps)=>{

  const textContainer = useRef<HTMLDivElement>(null)

  const anim = useCallback(()=>{
    if(!textContainer.current)
      return
    let $p = textContainer.current.getElementsByTagName("p")
    if($p[0] && textContainer.current.clientWidth <= $p[0].clientWidth){
      $p[0].className="runing"
      $p[0].innerHTML=`| ${text} | ${text}`
    }
    else{
      $p[0].className=""
    }
  },[text])

  useEffect(()=>{
    anim()
  },[anim])

  return(
    <div ref={textContainer} onClick={onClick} onContextMenu={onContextMenu} className={`runing-text ${className}`}>
      <p>{text}</p>
    </div>
  )
}
