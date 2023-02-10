import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { setTabs, setTitle } from '../../../store/reducers/menuReducer'
import { ScriptBlock } from './scriptBlock'
import { ScriptTrigger } from './trigger'

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

const getElementById = ()=>{

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

  return(
    <div className='container scroll'>
        <ScriptTrigger updata={updateTriggerScript} data={script.trigger}/>
        <div className='block-container'>
          {
            script.blocks.map((item, index)=>(
              <ScriptBlock key={index} data={item}/>
            ))
          }
        </div>
    </div>
  )
}
