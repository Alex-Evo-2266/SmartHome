import React,{useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {DialogWindowContext} from '../dialogWindow/dialogWindowContext'
import {AuthContext} from '../../context/AuthContext.js'
import {useHistory} from 'react-router-dom'

export const ScriptElement = ({script,updata})=>{
  const history = useHistory()
  const [status, setStatus] = useState(script.status)
  const {message} = useMessage();
  const {show, hide} = useContext(DialogWindowContext)
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)

  useEffect(()=>{
    setStatus(script.status)
  },[script, auth.userLevel])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const deleteScript = async()=>{
    show("alert",{
      title:"Delete script",
      text:`delete ${script.name}?`,
      buttons:[
        {
          title:"ok",
          action:async()=>{
            await request(`/api/script/delete?name=${script.name}`, 'GET',null ,{Authorization: `Bearer ${auth.token}`})
            updata()
            hide()
          }
        },
        {
          title:"cancel",
          action:hide
        },
      ]
    })
  }

  const runScript = async()=>{
    await request(`/api/script/run?name=${script.name}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  const checkedHandler = async event => {
    setStatus((prev)=>!prev)
    await request('/api/script/status/set', 'POST', {name:script.name,status:!status},{Authorization: `Bearer ${auth.token}`})
    if(typeof(updata)==="function")
    setTimeout(function () {
      updata()
    }, 600);
  }

  return(
    <div className="scriptElement">
      <p>{script.name}</p>
      <div className="scriptStatus">
        <button onClick={runScript} className="activateBtn">activate</button>
        {
          (auth.userLevel >= 3)?
          <button onClick={()=>history.push(`/scripts/edit/${script.name}`)} className="showBtn">edit</button>
          :null
        }
        <div className="switchConteiner">
        <p className="switchText">{(status)?"auto":"manual"}</p>
        {
          (script.trigger&&script.trigger[0]&&auth.userLevel >= 3)?
          <label className="switch">
            <input onChange={checkedHandler} name="auteStyle" type="checkbox" checked={(status)}></input>
            <span></span>
            <i className="indicator"></i>
          </label>
          :null
        }
        </div>
        {
          (auth.userLevel >= 3)?
          <button onClick={deleteScript} className="deleteBtn"><i className="fas fa-trash"></i></button>
          :null
        }
      </div>
    </div>
  )
}
