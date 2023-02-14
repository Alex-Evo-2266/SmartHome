import React,{useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { hideWindow, showCastomWindow } from '../../../store/reducers/modalWindowReducer'
import { EditIfBlock } from './EditConditionBlock'

export const IfBlock = ({data = null, updata}) => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const {devices} = useSelector(state=>state.socket)
  const [deviceTrigges, setDeviceTrigger] = useState([]);
  const [nextBlock, setNextBlock] = useState([]);
  const block = useRef(null)

  useEffect(()=>{
    return ()=>dispatch(hideWindow())
  },[dispatch, hideWindow])

  const edit = () => {
    dispatch(showCastomWindow("edit condition block", <EditIfBlock data={data} updata={updata}/>, [
        {title:"ok", action:()=>{
            dispatch(hideWindow())
        }}
    ],{
      width: "90%"
    }))
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
