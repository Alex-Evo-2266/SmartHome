import React, {useContext,useState,useEffect,useCallback} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const AddScriptsAct = ({result,type})=>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [scripts,setScripts] = useState([])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const out=(item)=>{
    if(typeof(result)==="function")
      result(item)
  }

  const updataScripts = useCallback(async()=>{
    const data = await request('/api/script/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    setScripts(data);
  },[request,auth.token])

  useEffect(()=>{
    updataScripts()
  },[updataScripts])

  return(
    <div className="box">
      <h2>type control element</h2>
        <ul>
        {
          scripts.map((item,index)=>{
            return(
              <li key={index} onClick={()=>out(item)}>
                <span>{index+1}</span>{item.name}
              </li>
            )
          })
        }
        </ul>
      </div>
  )

}
