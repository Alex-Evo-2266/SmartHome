import React, {useContext} from 'react'
import {AlertContext} from './alertContext'

export const Alert = ()=>{
  const {alert, hide} = useContext(AlertContext)

  if(!alert.visible){
    return null;
  }

  console.log(typeof(alert.Ok),alert);

  if(alert.type==="dialog"){
    return(
      <div className={`alert alert-${alert.type}`}>
        <div className="div-alert-container">
          <strong>Information</strong>
          <p>{alert.text}</p>
          <div className="div-alert-btnConteiner">
          {
            (typeof(alert.Ok)==="function")?
            <button onClick={()=>{
              alert.Ok()
              hide()
            }}>Yes</button>:null
          }
          {
            (typeof(alert.Ok)==="function"&&alert.No)?
            <button onClick={()=>{
              if(typeof(alert.No)==="function")
                alert.No()
              hide()
            }}>No</button>:null
          }
          </div>
          <button onClick={hide} type="button" className="close" aria-label="Close">
            <span aria-hidden='true'>
              &times;
            </span>
          </button>
        </div>
      </div>
    )
  }

  if(alert.type==="info"||alert.type==="information"){
    return (
    <div className={`alert alert-${alert.type}`}>
      <div className="div-alert-container">
        <strong>Information</strong>
        <p>{alert.text}</p>
        <button onClick={hide} type="button" className="close" aria-label="Close">
          <span aria-hidden='true'>
            &times;
          </span>
        </button>
      </div>
    </div>
  )
  }

  return (
    <div className={`alert alert-${alert.type || 'warning'}`}>
      <div className="div-alert-container">
        <strong>Attention!</strong>
        <p>{alert.text}</p>
        <button onClick={hide} type="button" className="close" aria-label="Close">
          <span aria-hidden='true'>
            &times;
          </span>
        </button>
      </div>
    </div>
  )
}
