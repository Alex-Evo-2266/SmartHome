import React,{useContext} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const BaseElement = ({children,deleteBtn,editBtn,index,data,onClick}) =>{
  const {target} = useContext(CartEditContext)

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    console.log("d");
    if(typeof(editBtn)==="function"){
      target("button-line",{...data,index},editBtn)
    }
  }

  return(
    <div className="baseCartElement-line">
      <div>
      {
        (deleteBtn)?
        <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
        null
      }
      {
        (editBtn)?
        <button className="editBtn" onClick={editbtn}>
          <i className="fas fa-list i-cost"></i>
          </button>:
          null
        }
      </div>
      <div className="ElementLine" onClick={onClick}>
      {children}
      </div>
    </div>
  )
}
