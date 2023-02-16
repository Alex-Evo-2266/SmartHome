import React,{useContext, useEffect, useRef} from 'react'
import { ScriptContext } from './ConnectContext';

const getX = (blocks, id, defX)=>{
    if (!id)
        return (defX)
    let block = blocks.filter(String(item=>item.id) === String(id))
    if (block.length === 0)
        return (defX)
    return (block[0].x)
}

const getY = (blocks, id, defY)=>{
    if (!id)
        return (defY)
    let block = blocks.filter(String(item=>item.id) === String(id))
    if (block.length === 0)
        return (defY)
    return (block[0].y)
}

export const ScriptConnector = ({x, y, endIdBlock, update}) => {

    const block = useRef(null)
    const {blocks} = useContext(ScriptContext);

    useEffect(()=>{
        if (!block.current) return;
        block.current.onmousedown = function(e) {
          if(e.target.closest(".script-block-no-move")) return
          e.preventDefault()
          block.current.style.position = 'absolute';
          moveAt(e);
          block.current.style.zIndex = 80;
          function moveAt(e) {
              block.current.style.left = e.pageX - block.current.offsetWidth / 2 + 'px';
              block.current.style.top = e.pageY - block.current.offsetHeight / 2 + 'px';
          }
          document.onmousemove = function(e) {
            moveAt(e);
          }
          block.current.onmouseup = function(e) {
            document.onmousemove = null;
            block.current.onmouseup = null;
            block.current.style.left = getX(blocks, endIdBlock, x) + "px";
            block.current.style.top = getY(blocks, endIdBlock, y) - 10 + "px";
            let id = document.elementFromPoint(e.clientX, e.clientY).closest(".script-block-container")?.dataset.id
            update(id, endIdBlock)
          }
        }
      },[block.current])

  return(
    <div ref={block} style={{top:getY(blocks, endIdBlock, y) - 10, left:getX(blocks, endIdBlock, x)}} className='script-connector'></div>
  )
}
