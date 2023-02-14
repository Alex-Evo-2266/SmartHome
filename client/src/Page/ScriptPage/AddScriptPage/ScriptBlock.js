import React,{useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { setTitle } from '../../../store/reducers/menuReducer'
import { ActiveBlock } from './ActiveBlock'
import { ScriptDeviceTrigger } from './DeviceTrigger'
import { IfBlock } from './IfBlock'

export const ScriptBlock = ({data = null, updata}) => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const {devices} = useSelector(state=>state.socket)
  const [deviceTrigges, setDeviceTrigger] = useState([]);
  const [nextBlock, setNextBlock] = useState([]);
  const block = useRef(null)

  useEffect(()=>{
    if (!block.current) return;
    block.current.onmousedown = function(e) {
      if(e.target.closest(".script-block-no-move")) return
      e.preventDefault()
      block.current.style.position = 'absolute';
      moveAt(e);
      block.current.style.zIndex = 80;
      function moveAt(e) {
        let containerPoz = block.current.parentNode.getBoundingClientRect()
        if (e.pageX - containerPoz.x - block.current.offsetWidth / 2 >= 0)
          block.current.style.left = e.pageX - containerPoz.x - block.current.offsetWidth / 2 + 'px';
        if (e.pageY - containerPoz.y - block.current.offsetHeight / 2 >= 0)
          block.current.style.top = e.pageY - containerPoz.y - block.current.offsetHeight / 2 + 'px';
      }
      document.onmousemove = function(e) {
        moveAt(e);
      }
      block.current.onmouseup = function() {
        document.onmousemove = null;
        block.current.onmouseup = null;
      }
    }
  },[block.current])


  return(
    <div ref={block} className='script-block-container card-container' style={{top:data.y, left:data.x}}>
      {
        (data.type === "action")?
        <ActiveBlock/>:
        (data.type === "condition")?
        <IfBlock/>:
        null
      }
    </div>
  )
}
