import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../context/SocketContext'
import {AddScriptContext} from '../addScript/addScriptContext'
import {ValueDeviceBlock} from './valueDeviceBlock'
import {TextBlock} from './textBlock'
import {EnumBlock} from './enumBlock'
import {NumberBlock} from './numberBlock'
import {MathBlock} from './mathBlock'

export const DelayBlock = ({updata,index,data,deleteEl})=>{

  const changeHandler = (event)=>{
    let element = data
    let val = element.value
    val = {...val, value:event.target.value}
    element.value = val
    updata({...element,index})
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        Delay
      </div>
      <div className="programm-function-block-content-item">
        <input type="number" onChange={changeHandler} value={data.value.value}/>
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
