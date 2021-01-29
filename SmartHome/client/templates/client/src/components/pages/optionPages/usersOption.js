import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {Loader} from '../../Loader'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const UsersOption = () =>{
  const auth = useContext(AuthContext)

  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [config,setConfig] = useState({
    registerKey:""
  })


  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const changeHandler = event => {
    setConfig({ ...config, [event.target.name]: event.target.value })
  }

  const configHandler = async(event)=>{
    await request(`/api/server/usersConfig/edit`, 'POST', config,{Authorization: `Bearer ${auth.token}`})
    window.location.reload();
  }

  const updataConf = useCallback(async()=>{
    const data = await request(`/api/server/usersConfig`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data)return;
    setConfig({
      registerKey:data.registerKey||""
    })
  },[request,auth.token])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  if(loading){
    return <Loader/>
  }

  return(
    <div className = "pagecontent">
      <div className="configElement">
        <p className="text">secret key</p>
        <label className="text">
          <input placeholder="key" onChange={changeHandler} name="registerKey" type="text" value={config.registerKey}/>
        </label>
      </div>
      <button onClick={configHandler}>Save</button>
    </div>
)
}
