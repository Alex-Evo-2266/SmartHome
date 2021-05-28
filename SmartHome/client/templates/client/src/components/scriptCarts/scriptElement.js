import React,{useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useHistory} from 'react-router-dom'

export const ScriptElement = ({script,updata})=>{
  const history = useHistory()
  const [status, setStatus] = useState(script.status)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)

  useEffect(()=>{
    setStatus(script.status)
  },[script])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const deleteScript = async()=>{
    await request(`/api/script/${script.id}`, 'DELETE',null ,{Authorization: `Bearer ${auth.token}`})
    updata()
  }

  const runScript = async()=>{
    await request(`/api/script/run/${script.id}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  }

  const checkedHandler = async event => {
    console.log(event.target.checked);
    setStatus((prev)=>!prev)
    await request('/api/script/set/status', 'POST', {id:script.id,status:!status},{Authorization: `Bearer ${auth.token}`})
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
        <button onClick={()=>history.push(`/scripts/edit/${script.id}`)} className="showBtn">edit</button>
        <div className="switchConteiner">
        <p className="switchText">{status}</p>
        {
          (script.trigger&&script.trigger[0])?
          <label className="switch">
            <input onChange={checkedHandler} name="auteStyle" type="checkbox" checked={(status)}></input>
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
