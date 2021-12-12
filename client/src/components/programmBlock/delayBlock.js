import React from 'react'

export const DelayBlock = ({updata,index,data,deleteEl})=>{

  const changeHandler = (event)=>{
    let element = data
    let val = element.value
    val = {...val, value:event.target.value}
    element.value = val
    updata({...element,index})
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        Delay
      </div>
      <div className="programm-function-block-content-item">
        <input type="number" onChange={changeHandler} value={data.value.value}/>
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
