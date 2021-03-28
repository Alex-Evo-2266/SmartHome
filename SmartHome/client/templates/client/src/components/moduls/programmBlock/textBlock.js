import React,{useState} from 'react'

export const TextBlock = ({action,updata,el,block,deleteEl})=>{
  const [value,setValue] = useState(action??"")
  const [delay, setDelay] = useState()

  const changeHandler = event=>{
    clearTimeout(delay)
    setValue(event.target.value)
    setDelay(setTimeout(function () {
      updata({action:event.target.value})
    }, 2000))
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        value
      </div>
      <div className="programm-function-block-content-item">
        <input type="text" onChange={changeHandler} value={value}/>
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl()}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
