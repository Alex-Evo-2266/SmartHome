import React,{useCallback, useContext, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { setTitle } from '../../../store/reducers/menuReducer'
import { ScriptContext } from './ConnectContext'
import { ScriptDeviceTrigger } from './DeviceTrigger'
import { ScriptConnector } from './ScriptConnector'

export const ScriptTrigger = ({data = null, update}) => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const {devices} = useSelector(state=>state.socket)
  const [deviceTrigges, setDeviceTrigger] = useState([]);
  const [nextBlock, setNextBlock] = useState([]);
  const {connectStatus, connect} = useContext(ScriptContext);

  useEffect(()=>{
    if(data?.devices && Array.isArray(data.devices))
      setDeviceTrigger(data.devices)
    if(data?.next && Array.isArray(data.next))
      setNextBlock(data.next)
  },[])

  const addTriggerDialog = () => {
    let deviceList = devices.map(item=>({title:item.name, data:item}))
    dispatch(showConfirmationDialog("Add trigger", deviceList, data=>{
        let fieldList = data.fields.map(item=>({title:item.name, data:item.name}))
        dispatch(showConfirmationDialog("Add trigger", fieldList, data2=>{
          console.log(fieldList,data2)
          dispatch(hideDialog())
          let newTriggersList = deviceTrigges.slice()
          newTriggersList.push({name:data.system_name, field:data2})
          setDeviceTrigger(newTriggersList)
        }))
    }))
  }

  const testFormat = data => data.name + "." + data.field

  const delTrigger = (index) => {
    setDeviceTrigger(prev => prev.filter((item, index2) => index2 !== index))
  }

  useEffect(()=>{
    if (typeof(update) === "function")
      update({devices:deviceTrigges, next:nextBlock})
  },[deviceTrigges, nextBlock])

  return(
    <div className='script-trigger-container card-container' id="trigger-block">
      <h2>Trigger</h2>
      <div className='dividers'></div>
      <div className='trigger-list tab-list'>
      {
          deviceTrigges.map((item, index)=>(
            <ScriptDeviceTrigger key={index} text={testFormat(item)} del={()=>delTrigger(index)}/>
          ))
      }
      </div>
      <div className='dividers'></div>
      <div className='card-btn-container'>
        <button className='btn add-trigger-btn' onClick={addTriggerDialog}>add trigger</button>
      </div>
      <div className='connect-dot-container'>
        <div className={`connect-dot ${(connectStatus.id === "trigger")?"active":""}`} onClick={()=>connect("trigger", "base")}></div>
      </div>
    </div>
  )
}
