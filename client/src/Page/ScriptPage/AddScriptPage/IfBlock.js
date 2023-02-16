import React,{useContext, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { hideWindow, showCastomWindow } from '../../../store/reducers/modalWindowReducer'
import { ScriptContext } from './ConnectContext'
import { EditConditionBlock } from './EditConditionBlock'

export const IfBlock = ({data = null, update}) => {

  const dispatch = useDispatch()
  const {connect} = useContext(ScriptContext);

  useEffect(()=>{
    return ()=>dispatch(hideWindow())
  },[dispatch, hideWindow])

  const edit = () => {
    dispatch(
      showCastomWindow(
        "edit condition block", 
        <EditConditionBlock 
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

  return(
    <>
        <div className='connect-dot-container'>
          <div className='connect-dot script-block-no-move' data-type="input" onClick={()=>connect(data.id, "input")}></div>
        </div>
        <h2>Condition block</h2>
        <div className='card-btn-container'>
            <button className='btn script-block-no-move' onClick={edit}>edit</button>
        </div>
        <div className='connect-dot-container'>
          <div className='connect-dot script-block-no-move' onClick={()=>connect(data.id, "base")}></div>
          <div className='connect-dot script-block-no-move' onClick={()=>connect(data.id, "else")}></div>
        </div>
    </>
  )
}
