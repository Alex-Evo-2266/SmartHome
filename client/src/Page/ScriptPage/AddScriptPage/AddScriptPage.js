import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { useScriptConnectBlock } from '../../../hooks/scriptDotConnect.hook'
import { hideDialog, showConfirmationDialog, showTextDialog } from '../../../store/reducers/dialogReducer'
import { setTabs, setTitle } from '../../../store/reducers/menuReducer'
import { ScriptContext } from './ConnectContext'
import { ScriptBlock } from './ScriptBlock'
import { ScriptTrigger } from './Trigger'

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
    if(block?.id >= max)
      max = block?.id
  }
  return (max + 1)
}

const updataElementById = (items, id, data)=>{
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
  const {dotClick, connectStatus, printLinckLine} = useScriptConnectBlock()
  const {request, error, clearError} = useHttp();
  const {message} = useMessage();
  const auth = useSelector(state=>state.auth)
  const [script, setScript] = useState({
    name:"",
    trigger:{
      devices:[],
      next:[]
    },
    blocks:[]
  })

  useEffect(()=>{
    message(error, 'error');
    clearError();
    return ()=>clearError()
  },[error, message, clearError])

  const addBlock = useCallback(()=>{
    dispatch(showConfirmationDialog("Add block", [
      {title: "condition", data: "condition"},
      {title: "action", data: "action"}
    ],
    data=>{
      dispatch(hideDialog())
      let id = getNextId(script.blocks)
      let blocks = script.blocks.slice()
      blocks.push(createBlock(id, data))
      setScript(prev=>({...prev, blocks}))
    }
    ))
  },[script.blocks, dispatch])

  const save = useCallback(() => {
    dispatch(showTextDialog("save script", "", "script name", async(data)=>{
      setScript(prev=>({...prev, name:data}))
      await request("/api/script", "POST", script, {Authorization: `Bearer ${auth.token}`})
    },script.name))
  },[script])

  const tabs = useCallback(()=>[
    {
      title:"add block",
      onClick:addBlock
    },
    {
      title:"save",
      onClick:save
    },
  ],[addBlock, save])

  useEffect(()=>{
    dispatch(setTitle("Add scripts"))
    dispatch(setTabs(tabs()))
  },[dispatch, tabs])

  useEffect(()=>{
    console.log(script)
  },[script])

  const updateTriggerScript = useCallback((trigger) => {
    setScript(prev=>({...prev, trigger}))
  },[])

  const updateBlock = useCallback((data, id) => {
    let blocks = script.blocks.slice()
    updataElementById(blocks, id, data)
    setScript(prev=>({...prev, blocks}))
  },[script.blocks])

  const updateBlockConnect = useCallback((type, data) => {
    if (type === "trigger")
      updateTriggerScript(data)
    else if (type === "block")
      updateBlock(data, data.id)
  },[updateTriggerScript, updateBlock])

  const deleteBlock = useCallback((id) => {
    let newBlocks = script.blocks.filter(item=>String(item.id) !== String(id))
    setScript(prev=>({...prev, blocks:newBlocks}))
  },[script])

  useEffect(()=>{
    const svg = document.querySelector("#svg-script")
    const root = document.querySelector("#container-script")
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    printLinckLine(svg, root, script.trigger, script.blocks)
  },[script, printLinckLine])

  return(
    <ScriptContext.Provider value={{blocks: script.blocks, connectStatus, connect: dotClick(script.blocks, script.trigger, updateBlockConnect)}}>
    <svg className='' id="svg-script" viewBox="0 0 1000 1000" preserveAspectRatio="none"></svg>
    <div id="container-script" className='container scroll block-container'>
        <ScriptTrigger update={updateTriggerScript} data={script.trigger}/>
          {
            script.blocks.map((item, index)=>(
              <ScriptBlock key={index} data={item} update={(data)=>updateBlock(data, item.id)} deleteBlock={()=>deleteBlock(item.id)}/>
            ))
          }
    </div>
    </ScriptContext.Provider>
  )
}
