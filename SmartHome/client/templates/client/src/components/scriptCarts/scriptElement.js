import React,{useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {AddScriptContext} from '../addScript/addScriptContext'

export const ScriptElement = ({script,updata})=>{
  const {showData} = useContext(AddScriptContext)
  const [status, setStatus] = useState(script.ScriptStatus)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)

  useEffect(()=>{
    setStatus(script.ScriptStatus)
  },[script])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const deleteScript = async()=>{
    await request(`/api/script/delete`, 'POST', {ScriptId:script.ScriptId},{Authorization: `Bearer ${auth.token}`})
    updata()
  }

  const runScript = async()=>{
    await request(`/api/script/run/${script.ScriptId}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  const checkedHandler = async event => {
    console.log(event.target.checked);
    if(status==="trigger"){
      setStatus("manual")
      await request('/api/script/set/status', 'POST', {ScriptId:script.ScriptId,ScriptStatus:"manual"},{Authorization: `Bearer ${auth.token}`})
    }else {
      setStatus("trigger")
      await request('/api/script/set/status', 'POST', {ScriptId:script.ScriptId,ScriptStatus:"trigger"},{Authorization: `Bearer ${auth.token}`})
    }
    if(typeof(updata)==="function")
    setTimeout(function () {
      updata()
    }, 600);
  }

  return(
    <div className="scriptElement">
      <p>{script.ScriptName}</p>
      <div className="scriptStatus">
        <button onClick={runScript} className="activateBtn">activate</button>
        <button onClick={()=>showData("showScript",script)} className="showBtn">show</button>
        <div className="switchConteiner">
        <p className="switchText">{status}</p>
        {
          (script.ScriptTrigger&&script.ScriptTrigger[0])?
          <label className="switch">
            <input onChange={checkedHandler} name="auteStyle" type="checkbox" checked={(status==="trigger")}></input>
            <span></span>
            <i className="indicator"></i>
          </label>
          :null
        }
        </div>
        <button onClick={deleteScript} className="deleteBtn"><i className="fas fa-trash"></i></button>
      </div>
    </div>
  )
}
