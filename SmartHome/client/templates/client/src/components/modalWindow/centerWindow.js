import React from 'react'
import {BackForm} from '../moduls/backForm'

export const CenterWindow = ({
  children,
  hide
})=>{
  return (
    <BackForm onClick={hide}>
    <div className={`centerWindow`} >
      <div className="centerWindowContent">
        {children}
      </div>
    </div>
    </BackForm>
  )
}
