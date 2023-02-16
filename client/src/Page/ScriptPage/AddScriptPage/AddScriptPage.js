import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch} from 'react-redux'
import { useScriptConnectBlock } from '../../../hooks/scriptDotConnect.hook'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { setTabs, setTitle } from '../../../store/reducers/menuReducer'
import { ScriptContext } from './ConnectContext'
import { ScriptBlock } from './ScriptBlock'
import { ScriptTrigger } from './Trigger'

function map(n, a, b, _a, _b) {
  let d = b - a;
  let _d = _b - _a;
  let u = _d / d;
  return _a + n * u;
}

const createBlock = (id, type)=>({
  id,
  x:0,
  y:0,
  next:{base:[]},
  type,
  content_type:"",
  arg1:"",
  arg2:"",
  value:"",
  operator:""
})

const getNextId = (blocks)=>{
  let max = 0
  for(let block of blocks)
  {
    console.log(block)
    if(block?.id >= max)
    {
      max = block?.id
    }
  }
  return (max + 1)
}

const updataElementById = (items, id, data)=>{
  console.log(items, id, data)
  for (let item of items)
  {
    if (item.id === id)
    {
      item.arg1 = data.arg1
      item.arg2 = data.arg2
      item.operator = data.operator
      item.value = data.value
      item.type_object = data.type_object
      item.x = data.x
      item.y = data.y
    }
  }
}

export const AddScriptPage = () => {

  const dispatch = useDispatch()
  const svg = useRef(null)
  const trigger = useRef(null)
  const {} = useScriptConnectBlock()
  const [connectStatus, setConnectStatus] = useState({
    id:null,
    metka:null
  })
  const [script, setScript] = useState({
    trigger:{
      devices:[],
      next:[]
    },
    blocks:[]
  })

  const addBlock = useCallback(()=>{
    dispatch(showConfirmationDialog("Add block", [
      {
        title: "condition",
        data: "condition"
      },
      {
        title: "action",
        data: "action"
      }
    ],
    data=>{
      dispatch(hideDialog())
      let id = getNextId(script.blocks)
      let blocks = script.blocks.slice()
      console.log(id, blocks)
      blocks.push(createBlock(id, data))
      setScript(prev=>({...prev, blocks}))
    }
    ))
  },[script.blocks, dispatch])

  const tabs = useCallback(()=>[
    {
      title:"add block",
      onClick:()=>addBlock()
    }
  ],[addBlock])

  useEffect(()=>{
    dispatch(setTitle("Add scripts"))
    dispatch(setTabs(tabs()))
  },[dispatch, tabs])

  useEffect(()=>{
    console.log(script)
  },[script])

  const updateTriggerScript = useCallback((trigger) => {
    console.log(trigger)
    setScript(prev=>({...prev, trigger}))
  },[])

  const updateBlock = useCallback((data, id) => {
    console.log(data, id)
    let blocks = script.blocks.slice()
    updataElementById(blocks, id, data)
    setScript(prev=>({...prev, blocks}))
  },[script.blocks])

  useEffect(()=>{
    console.log(connectStatus)
  },[connectStatus])

  const getBlock = useCallback((id)=>{
    let block = script.blocks.filter(item => item.id === id)
    if (block.length === 0)
      return (null)
    return (block[0])
  },[script.blocks])

  const triggerConnect = useCallback((trigger, id)=>{
    let ids = trigger.next.filter(item=>item === id)
    trigger.next = trigger.next.filter(item=>item !== id)
    if (ids.length === 0)
      trigger.next.push(id)
    updateTriggerScript(trigger)
  },[updateTriggerScript])

  const blockConnect = useCallback((block, metka, id)=>{
    let next = block.next
    console.log(next)
    let ids = next[metka]?.filter(item=>item === id) || []
    next[metka] = next[metka]?.filter(item=>item !== id) || []
    if (ids.length === 0)
      next[metka].push(id)
    console.log(next)
    updateBlock({...block, next})
  },[updateBlock])

  const c1 = useCallback((b1, b2)=>{
    console.log(b1, b2)
    if (b1.metka !== "input" && b2.metka === "input")
    {
      if(b1.id === "trigger")
        triggerConnect(script.trigger, b2.id)
      else
      {
        let block = getBlock(b1.id)
        blockConnect(block, b1.metka, b2.id)
      }
    }
    else if (b1.metka === "input" && b2.metka !== "input")
    {
      if(b2.id === "trigger")
        triggerConnect(script.trigger, b1.id)
      else
      {
        let block = getBlock(b2.id)
        blockConnect(block, b2.metka, b1.id)
      }
    }
    else
    {

    }
  },[getBlock, script, triggerConnect, blockConnect])

  const connect = useCallback((id, metka)=>{
    console.log("p0")
    if (connectStatus.id)
    {
      if (connectStatus.id !== id)
        c1(connectStatus, {id, metka})
      setConnectStatus({id:null, metka:null})
    }
    else
    {
      setConnectStatus({id, metka})
    }
  },[connectStatus, c1])

const SVG_NS = 'http://www.w3.org/2000/svg';


  const drawConnector = useCallback((a,b)=>{
    console.log(a,b)
    let path = document.createElementNS(SVG_NS, 'path');
    // let d = `M${a.x},${a.y} C50,${a.y} 50 ${b.y} ${b.x} ${b.y}`;
    let d = `M${a.x},${a.y} L${b.x} ${b.y}`;
    path.setAttributeNS(null,"d",d);
    svg.current.appendChild(path)
  },[svg.current])

  const printBlockConnect = useCallback((dotOut, blocksIn) => {
    let blocks = document.querySelectorAll(".script-block")
    let mainBox = svg.current.getBoundingClientRect()
    let outCord = dotOut.getBoundingClientRect()
    console.log(blocks, blocksIn)
    let filteredBlock = Array.prototype.filter.call(blocks, item => blocksIn.filter(item2 => String(item2) === String(item.dataset.id)).length !== 0)
    console.log(filteredBlock)
    filteredBlock.forEach(block => {
      let dot = block.querySelector('.connect-dot[data-type="input"]')
      let cord = dot.getBoundingClientRect()
      console.log(cord,outCord)
      drawConnector({
        x:map(outCord.x + outCord.width / 2, mainBox.left, mainBox.left + mainBox.width, 0, 1000), 
        y:map(outCord.y + outCord.height / 2, mainBox.top, mainBox.top + mainBox.height, 0, 1000)
      }, {
        x:map(cord.x + cord.width / 2, mainBox.left, mainBox.left + mainBox.width, 0, 1000) , 
        y:map(cord.y + cord.height / 2, mainBox.top, mainBox.top + mainBox.height, 0, 1000)
      })
    })
  },[svg.current, script.trigger.next, drawConnector])

  const p2 = useCallback(() => {
    let triggerNode = trigger.current
    let dot = triggerNode.querySelector('.connect-dot')
    console.log(dot)
    printBlockConnect(dot, script.trigger.next)

  },[trigger.current, script.trigger, printBlockConnect])

  const print = useCallback(() => {
    if (!svg.current || !trigger.current) return;
    let mainBox = svg.current.getBoundingClientRect()
    let triggerCord = trigger.current.getBoundingClientRect()
    console.log(trigger.current, triggerCord)
    let g = document.querySelectorAll(".script-block")
    g.forEach(element => {
      console.log(element)
      console.log(element.querySelector('.connect-dot[data-type="input"]'))
      let dot = element.querySelector('.connect-dot[data-type="input"]')
      let cord = dot.getBoundingClientRect()
      console.log(element.dataset.id, script.trigger.next)
      let cond = script.trigger.next.filter(item=>String(item) === String(element.dataset.id))
      console.log(cond)
      if (cond.length !== 0)
        drawConnector({
          x:map(triggerCord.width / 2, -mainBox.left, mainBox.left + mainBox.width, 0, 100), 
          y:map(triggerCord.height, -mainBox.left, mainBox.left + mainBox.width, 0, 100)
        }, {
          x:map(cord.x, -mainBox.left, mainBox.width - mainBox.left, 0, 100) , 
          y:map(cord.y, -mainBox.left, mainBox.left + mainBox.width, 0, 100)
        })
    });
  },[svg.current, script.trigger.next])

  useEffect(()=>{
    console.log(trigger.current)
    while (svg.current.lastChild) {
      svg.current.removeChild(svg.current.lastChild);
    }
    // print()
    p2()
    // printBlockConnect("", script.trigger.next)
  },[trigger.current, script, svg.current, p2])

  return(
    <ScriptContext.Provider value={{blocks: script.blocks, connect}}>
    <svg ref={svg} className='' id="svg-script" viewBox="0 0 1000 1000" preserveAspectRatio="none"></svg>
    <div className='container scroll block-container'>
        <ScriptTrigger ref2={trigger} update={updateTriggerScript} data={script.trigger}/>
          {
            script.blocks.map((item, index)=>(
              <ScriptBlock key={index} data={item} update={(data)=>updateBlock(data, item.id)}/>
            ))
          }
    </div>
    </ScriptContext.Provider>
  )
}
