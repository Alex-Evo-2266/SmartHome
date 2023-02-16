import React,{useCallback, useContext, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { hideWindow, showCastomWindow } from '../../../store/reducers/modalWindowReducer'
import { ScriptContext } from './ConnectContext'
import { EditConditionBlock } from './EditConditionBlock'

export const IfBlock = ({data = null, update, deleteBlock}) => {

  const dispatch = useDispatch()
  const {connectStatus, connect} = useContext(ScriptContext);

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
          deleteEl={deleteBlock}
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
        <h2>Condition block</h2>
        <p className='padding'>{data.arg1}.{data.arg2} {data.operator} {JSON.stringify(data.value)}</p>
        <div className='card-btn-container'>
            <button className='btn script-block-no-move' onClick={edit}>edit</button>
        </div>
        <div className='connect-dot-container'>
          <div data-type="base" className={`connect-dot script-block-no-move ${(isActive("base"))?"active":""}`} onClick={()=>connect(data.id, "base")}></div>
          <div data-type="else" className={`connect-dot script-block-no-move ${(isActive("else"))?"active":""}`} onClick={()=>connect(data.id, "else")}></div>
        </div>
    </>
  )
}
