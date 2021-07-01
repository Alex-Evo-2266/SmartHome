import React from 'react'

export const TypeAct = ({result})=>{

  const out=(item)=>{
    if(typeof(result)==="function")
      result(item)
  }

  return(
    <div className="box">
      <h2>type control element</h2>
        <ul>
          <li onClick={()=>out("device")}>
            <span>1</span>device
          </li>
          <li onClick={()=>out("script")}>
            <span>2</span>script
          </li>
        </ul>
      </div>
  )

}
