import React,{useContext, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'
import { ScriptContext } from './ConnectContext'
import { ScriptDeviceTrigger } from './DeviceTrigger'

export const ScriptTrigger = ({data = null, update}) => {

  const dispatch = useDispatch()
  const {devices} = useSelector(state=>state.socket)
  const [deviceTrigges, setDeviceTrigger] = useState([]);
  const {connectStatus, connect} = useContext(ScriptContext);
  const read = useRef(0)

  useEffect(()=>{
    if(data?.trigger && Array.isArray(data.trigger) && read.current < 1)
      setDeviceTrigger(data.trigger)
    read.current = read.current + 1
  },[data.next, data.trigger])

  const addTriggerDialog = () => {
    let deviceList = devices.map(item=>({title:item.name, data:item}))
    dispatch(showConfirmationDialog("Add trigger", deviceList, data=>{
        let fieldList = data.fields.map(item=>({title:item.name, data:item.name}))
        dispatch(showConfirmationDialog("Add trigger", fieldList, data2=>{
          dispatch(hideDialog())
          let newTriggersList = deviceTrigges.slice()
          newTriggersList.push({arg1:data.system_name, arg2:data2})
          setDeviceTrigger(newTriggersList)
        }))
    }))
  }

  const testFormat = data => data.arg1 + "." + data.arg2

  const delTrigger = (index) => {
    setDeviceTrigger(prev => prev.filter((item, index2) => index2 !== index))
  }

  useEffect(()=>{
    if (typeof(update) === "function")
      update({trigger:deviceTrigges, next:data.next})
  },[deviceTrigges, update])

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
