import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { setTabs, setTitle } from '../../../store/reducers/menuReducer'
import { ScriptBlock } from './ScriptBlock'
import { ScriptTrigger } from './Trigger'

const createBlock = (id, type)=>({
  id,
  x:0,
  y:0,
  next:[],
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
  for (let item of items)
  {
    if (item.id === id)
    {
      item.arg1 = data.arg1
      item.arg2 = data.arg2
      item.operator = data.operator
      item.value = data.value
      item.type_object = data.type_object
    }
  }
}

export const AddScriptPage = () => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
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
  },[script.blocks])

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

  const updateTriggerScript = (trigger) => {
    setScript(prev=>({...prev, trigger}))
  }

  const updateBlock = (data, id) => {
    console.log(data, id)
    let blocks = script.blocks.slice()
    updataElementById(blocks, id, data)
    setScript(prev=>({...prev, blocks}))
  }

  return(
    <div className='container scroll'>
        <ScriptTrigger update={updateTriggerScript} data={script.trigger}/>
        <div className='block-container'>
          {
            script.blocks.map((item, index)=>(
              <ScriptBlock key={index} data={item} update={(data)=>updateBlock(data, item.id)}/>
            ))
          }
        </div>
    </div>
  )
}
