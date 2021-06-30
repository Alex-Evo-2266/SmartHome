import React,{useContext,useEffect,useState,useCallback} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {useMessage} from '../../../hooks/message.hook'

export const ActScript = ({updata,index,data,deleteEl})=>{

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        script: {data.DeviceId}
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
