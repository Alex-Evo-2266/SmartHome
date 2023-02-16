import {useState, useCallback} from 'react'
import { useDispatch } from 'react-redux';
import { HIDE_ALERT, SHOW_ALERT } from '../store/types';
const SVG_NS = 'http://www.w3.org/2000/svg';

function map(n, a, b, _a, _b) {
    let d = b - a;
    let _d = _b - _a;
    let u = _d / d;
    return _a + n * u;
  }

export const useScriptConnectBlock = () => {

    // connect dots 

    const [connectStatus, setConnectStatus] = useState({
        id:null,
        metka:null
    })

    const getBlock = (blocks, id)=>{
        let block = blocks.filter(item => item.id === id)
        if (block.length === 0)
          return (null)
        return (block[0])
    }

    const triggerConnect = useCallback((trigger, id, updateBlock)=>{
        let ids = trigger.next.filter(item=>item === id)
        trigger.next = trigger.next.filter(item=>item !== id)
        if (ids.length === 0)
          trigger.next.push(id)
          updateBlock("trigger", trigger)
    },[])
    
    const blockConnect = useCallback((block, metka, id, updateBlock)=>{
        if (!block) return;
        let next = block.next
        let ids = next[metka]?.filter(item=>item === id) || []
        next[metka] = next[metka]?.filter(item=>item !== id) || []
        if (ids.length === 0)
          next[metka].push(id)
        updateBlock("block", {...block, next})
    },[])

    const blocksSvitch = useCallback((blocks, trigger, updateBlock, b1, b2)=>{
        if (b1.metka !== "input" && b2.metka === "input")
        {
          if(b1.id === "trigger")
            triggerConnect(trigger, b2.id, updateBlock)
          else
            blockConnect(getBlock(blocks, b1.id), b1.metka, b2.id, updateBlock)
        }
        else if (b1.metka === "input" && b2.metka !== "input")
        {
          if(b2.id === "trigger")
            triggerConnect(trigger, b1.id, updateBlock)
          else
            blockConnect(getBlock(blocks, b2.id), b2.metka, b1.id, updateBlock)
        }
    },[getBlock, triggerConnect, blockConnect])

    const dotClick = useCallback((blocks, trigger, updateBlock)=>(
        (id, metka)=>{
            if (connectStatus.id)
            {
                if (connectStatus.id !== id)
                blocksSvitch(blocks, trigger, updateBlock, connectStatus, {id, metka})
                setConnectStatus({id:null, metka:null})
            }
            else
            {
                setConnectStatus({id, metka})
            }
        }
    ),[connectStatus, blocksSvitch])


    // print line


  const drawConnector = useCallback((svg, a, b)=>{
    let path = document.createElementNS(SVG_NS, 'path');
    let d = `M${a.x},${a.y} L${b.x} ${b.y}`;
    path.setAttributeNS(null,"d",d);
    svg.appendChild(path)
  },[])

  const printBlockConnect = useCallback((svg, dotOut, blocksIn) => {
    let blocks = document.querySelectorAll(".script-block")
    let mainBox = svg.getBoundingClientRect()
    let outCord = dotOut.getBoundingClientRect()
    let filteredBlock = Array.prototype.filter.call(blocks, item => blocksIn.filter(item2 => String(item2) === String(item.dataset.id)).length !== 0)
    filteredBlock.forEach(block => {
      let dot = block.querySelector('.connect-dot[data-type="input"]')
      let cord = dot.getBoundingClientRect()
      drawConnector(svg, {
        x:map(outCord.x + outCord.width / 2, mainBox.left, mainBox.left + mainBox.width, 0, 1000), 
        y:map(outCord.y + outCord.height / 2, mainBox.top, mainBox.top + mainBox.height, 0, 1000)
      }, {
        x:map(cord.x + cord.width / 2, mainBox.left, mainBox.left + mainBox.width, 0, 1000) , 
        y:map(cord.y + cord.height / 2, mainBox.top, mainBox.top + mainBox.height, 0, 1000)
      })
    })
  },[drawConnector])

  const OutDot = (svg, blocks)=>{
    blocks.forEach(item=>{
      let blocksNode = document.querySelectorAll(".script-block")
      let filteredBlock = Array.prototype.filter.call(blocksNode, item2 => String(item2.dataset.id) === String(item.id))
      if (filteredBlock.length === 0) return;
      filteredBlock = filteredBlock[0]
      for (const key in item.next) {
        let dot = filteredBlock.querySelector(`.connect-dot[data-type="${key}"]`)
        printBlockConnect(svg, dot, item.next[key])
      }
    })
  }

  const printLinckLine = useCallback((svg, root, trigger, blocks) => {
    OutDot(svg, blocks)
    let triggerNode = root.querySelector("#trigger-block")
    if (!triggerNode) return
    let dot = triggerNode.querySelector('.connect-dot')
    printBlockConnect(svg, dot, trigger.next)
  },[printBlockConnect, OutDot])
  
  return {dotClick, connectStatus, printLinckLine}
}
