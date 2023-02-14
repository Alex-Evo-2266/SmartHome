import React,{useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { hideWindow, showCastomWindow } from '../../../store/reducers/modalWindowReducer'
import { EditConditionBlock } from './EditConditionBlock'

export const IfBlock = ({data = null, update}) => {

  const dispatch = useDispatch()

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
        <h2>Condition block</h2>
        <div className='card-btn-container'>
            <button className='btn script-block-no-move' onClick={edit}>edit</button>
        </div>
    </>
  )
}
