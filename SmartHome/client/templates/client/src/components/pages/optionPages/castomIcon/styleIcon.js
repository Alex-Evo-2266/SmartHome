import React from 'react'

export const StyleIcon = ({colors}) =>{

  return(
    <div className="miniWindow" style={{borderColor: colors.c1}}>
      <div className="miniHeader" style={{background:colors.c1}}></div>
      <div className="miniMain" style={{background:colors.c2}}>
        <div className="miniContent">
          <div className="miniDiv" style={{background:colors.c3}}></div>
          <div className="miniDiv" style={{background:colors.c3}}></div>
          <div className="miniDiv" style={{background:colors.c3}}></div>
        </div>
      </div>
    </div>
  )
}
