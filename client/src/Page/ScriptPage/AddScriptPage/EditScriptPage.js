import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
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
  type_object:"",
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

const getMaxHeight = (script) =>{
  let max = window.innerHeight
  for (const item of script.blocks) {
    if(item.y > max)
      max = item.y
  }
  return (max)
}

export const EditScriptPage = ({}) => {

  const dispatch = useDispatch()
  let { scriptName } = useParams();
  const {dotClick, connectStatus, printLinckLine} = useScriptConnectBlock()
  const {request, error, clearError} = useHttp();
  const {message} = useMessage();
  const auth = useSelector(state=>state.auth)
  const [addHeight, setAddHeight] = useState(1)
  const [read, setRead] = useState(false)
  const [script, setScript] = useState({
    name:"",
    trigger:{
      trigger:[],
      next:[]
    },
    blocks:[]
  })

  const getScript = useCallback(async() => {
    let data = await request(`/api/scripts/${scriptName}`, "GET", null, {Authorization: `Bearer ${auth.token}`})
    if (data)  
      setScript(data)
  },[request, auth.token, scriptName])

  useEffect(()=>{
    if (!scriptName) return;
    getScript()
  },[getScript, scriptName])

  useEffect(()=>{
    if (scriptName && !read)
    {
      let y = getMaxHeight(script)
      setAddHeight(y - window.innerHeight + 200)
      console.log(y, document.body.clientHeight, window.innerHeight)
    }
    if (script.name === scriptName)
      setRead(true)
  },[script, scriptName])

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
      if (!scriptName)
        await request("/api/scripts", "POST", {...script, name: data}, {Authorization: `Bearer ${auth.token}`})
      else
        await request(`/api/scripts/${script.name}`, "PUT", {...script, name: data}, {Authorization: `Bearer ${auth.token}`})
      setScript(prev=>({...prev, name:data}))
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
    return ()=>dispatch(setTabs([]))
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

  const infScrol = useCallback(() =>{
           
      var block = document.getElementById('edit-script-page');
     
      var contentHeight = block.offsetHeight;     
      var yOffset       = window.pageYOffset;   
      var window_height = window.innerHeight;     
      var y             = yOffset + window_height;
     
      if(y >= contentHeight)
      {
          setAddHeight(prev=>prev += 200)
      }
  },[])

  useEffect(()=>{
    window.addEventListener("scroll", infScrol)
    return () => {
      window.removeEventListener("scroll", infScrol)
    }
  },[infScrol])

  useEffect(()=>{
    var block = document.getElementById('edit-script-page');
    block.style.height = `calc(100vh + ${addHeight}px)`
  },[addHeight])
  

  return(
    <ScriptContext.Provider value={{blocks: script.blocks, connectStatus, connect: dotClick(script.blocks, script.trigger, updateBlockConnect)}}>
    <div id="edit-script-page" className='full-scrin'>
      <svg className='' id="svg-script" viewBox={`0 0 1000 ${1000 + addHeight}`} preserveAspectRatio="none"></svg>
      <div id="container-script" className='block-container'>
        <ScriptTrigger update={updateTriggerScript} data={script.trigger}/>
          {
            script.blocks.map((item, index)=>(
              <ScriptBlock key={index} data={item} update={(data)=>updateBlock(data, item.id)} deleteBlock={()=>deleteBlock(item.id)}/>
            ))
          }
      </div>
    </div>
    </ScriptContext.Provider>
  )
}
