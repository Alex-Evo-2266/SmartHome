import React, {useContext} from 'react'
import {AlertContext} from './alertContext'

export const Alert = ()=>{
  const {alert, hide} = useContext(AlertContext)

    return(
      <div className={`alert ${(alert.visible)?"show":"hide"} alert-${alert.type}`}>
        <div className="div-alert-container">
          <p>{alert.text}</p>
          <div className="div-alert-btnConteiner">
          {
            (typeof(alert.Ok)==="function")?
            <button className="normalSelection button" onClick={()=>{
              alert.Ok()
              hide()
            }}>Yes</button>:null
          }
          {
            (typeof(alert.Ok)==="function"&&alert.No)?
            <button style={{marginLeft:"10px"}} className="normalSelection button" onClick={()=>{
              if(typeof(alert.No)==="function")
                alert.No()
              hide()
            }}>No</button>:
            <button style={{marginLeft:"10px"}} className="highSelection button" onClick={hide}>Cancel</button>
          }
          </div>
        </div>
      </div>
    )
}
