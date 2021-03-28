import React from 'react'
import {BackForm} from '../moduls/backForm'

export const CenterWindow = ({
  children,
  className,
  hide
})=>{
  return (
    <BackForm onClick={hide}>
    <div className={`centerWindow`} >
      <div className={`centerWindowContent ${className}`}>
        {children}
      </div>
    </div>
    </BackForm>
  )
}
