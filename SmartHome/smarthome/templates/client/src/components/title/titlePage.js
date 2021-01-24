import React,{useState,useEffect,useCallback} from 'react'

export const Title = ({children})=>{

  const[position, setPosition] = useState(false);

  const titleTransform = useCallback(()=>{
    let title = document.getElementById('titlePage')
    if(!title)  return;
    let top = title.parentNode.getBoundingClientRect().y||0;
    if((top<=-100&&!position)||(top<=-80&&position)){
      setPosition(true);
    }
    else {
      setPosition(false);
    }
  },[position])

useEffect(()=>{
  window.addEventListener('scroll',titleTransform);
  return ()=>{
    window.removeEventListener('scroll',titleTransform);
  }
},[titleTransform])

  return (
    <div id="titlePage" className = {`titlePage ${(position)?"titleTop":"titleDefault"}`}>
      {children}
    </div>
  )
}
