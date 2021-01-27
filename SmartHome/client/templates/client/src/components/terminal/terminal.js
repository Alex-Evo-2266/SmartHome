import React, {useContext,useEffect,useState} from 'react'

export const Terminal = ()=>{
  const [inputmes, setInputmes] = useState("")


  const changeHandler = (event) => setInputmes(event.target.value)

  const output = (event)=>{
    if(event.keyCode === 13){
      if(!inputmes)return;
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
