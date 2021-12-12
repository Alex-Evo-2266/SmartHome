import React from 'react'

export const ActScript = ({updata,index,data,deleteEl})=>{

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        script: {data.systemName}
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
