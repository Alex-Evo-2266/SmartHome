import React,{useContext} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const BaseElement = ({children,deleteBtn,editBtn,index,data}) =>{
  const {target} = useContext(CartEditContext)

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data,index},editBtn)
    }
  }

  return(
    <div className="baseCartElement-box">
    {
      (deleteBtn || editBtn)?
      <div className="delete-box">
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
      :null
    }
      {children}
    </div>
  )
}
