import React from 'react'

export const BackForm = ({children,onClick,className})=>{

  const click = (event) =>{
    let str = event.target.className.split(" ");
    for (var item of str) {
      if(item === "backForm"&&typeof(onClick)==="function")
        onClick(event);
    }
  }

  return(
    <div className = {`backForm ${className}`} onClick = {click}>
      {children}
    </div>
  )
}
