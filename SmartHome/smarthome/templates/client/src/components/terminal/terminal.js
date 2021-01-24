import React, {useContext,useEffect,useState} from 'react'
import {SocketContext} from '../../hooks/socket.hook'

export const Terminal = ()=>{
  const socket = useContext(SocketContext)
  const [inputmes, setInputmes] = useState("")
  const [lod, setLod] = useState(false)

  useEffect(()=>{
    if(lod){
      let area = document.getElementById('area')
      area.value = area.value + `System: ${socket.message.message}\n`
    }
    else{
      setLod(true)
    }
  },[socket.message,lod])

  const changeHandler = (event) => setInputmes(event.target.value)

  const output = (event)=>{
    if(event.keyCode === 13){
      if(!inputmes)return;
      socket.terminalMessage(inputmes)
      let area = document.getElementById('area')
      area.value = area.value + `You:${inputmes}\n`
      setInputmes("")
      event.preventDefault();
    }
  }

  const focus = () => document.getElementById('terminalInput').focus()

  return(
    <div className = "terminal">
      <textarea id="area" readOnly={true} onClick={focus}>
      </textarea>
      <div className = "terminalInput">
        <input id="terminalInput" type="text" onKeyDown={output} onChange={changeHandler} value = {inputmes}/>
      </div>
    </div>
  )
}
