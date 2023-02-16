import React,{useCallback, useContext, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { ScriptContext } from './ConnectContext'
import { hideWindow, showCastomWindow } from '../../../store/reducers/modalWindowReducer'
import { EditActiveBlock } from './EditActiveBlock'

export const ActiveBlock = ({data = null, update}) => {

  const dispatch = useDispatch()
  const {connectStatus, connect} = useContext(ScriptContext);

  useEffect(()=>{
    return ()=>dispatch(hideWindow())
  },[dispatch, hideWindow])

  const edit = () => {
    dispatch(
      showCastomWindow(
        "edit active block", 
        <EditActiveBlock 
          data={data} 
          update={update} 
          hide={()=>dispatch(hideWindow())}
        />, 
        [],
        {
          width: "90%"
        }
      )
    )
  }

  const isActive = useCallback((metka) => {
    return (String(connectStatus.id) === String(data.id) && connectStatus.metka === metka)
  },[connectStatus])

  return(
    <>
        <div className='connect-dot-container'>
          <div className={`connect-dot script-block-no-move ${(isActive("input"))?"active":""}`} data-type="input" onClick={()=>connect(data.id, "input")}></div>
        </div>
        <h2>Active block</h2>
        <div className='card-btn-container'>
            <button className='btn script-block-no-move' onClick={edit}>edit</button>
        </div>
        <div className='connect-dot-container'>
          <div data-type="base" className={`connect-dot script-block-no-move ${(isActive("base"))?"active":""}`} onClick={()=>connect(data.id, "base")}></div>
        </div>
    </>
  )
}
