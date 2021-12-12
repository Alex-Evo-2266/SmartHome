import React from 'react'

export const Loader = ({style}) =>{
  return(
  <div className="loader" style={{...style}}>
    <div className="face face1">
      <div className="circle"></div>
    </div>
    <div className="face face2">
      <div className="circle"></div>
    </div>
  </div>
)
}
