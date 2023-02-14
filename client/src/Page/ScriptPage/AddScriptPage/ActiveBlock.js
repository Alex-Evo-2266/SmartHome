import React,{useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { setTitle } from '../../../store/reducers/menuReducer'
import { ScriptDeviceTrigger } from './DeviceTrigger'

export const ActiveBlock = ({data = null, updata}) => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const {devices} = useSelector(state=>state.socket)
  const [deviceTrigges, setDeviceTrigger] = useState([]);
  const [nextBlock, setNextBlock] = useState([]);
  const block = useRef(null)

  const edit = () => {

  }

  return(
    <>
        <h2>Active block</h2>
        <div className='card-btn-container'>
            <button className='btn script-block-no-move' onClick={edit}>edit</button>
        </div>
    </>
  )
}
