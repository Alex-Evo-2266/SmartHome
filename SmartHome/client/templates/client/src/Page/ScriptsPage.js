import React,{useState,useEffect,useCallback,useContext} from 'react'
import {Link} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {Loader} from '../components/Loader'
import {ScriptElement} from '../components/scriptCarts/scriptElement'
import {AddScriptBase} from '../components/addScript/addScriptBase'

export const ScriptsPage = () => {
  const [scripts, setScripts] = useState([])
  const [allScripts, setAllScripts] = useState([])
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading,request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const updataScripts = useCallback(async()=>{
    const data = await request('/api/script/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    setScripts(data);
    setAllScripts(data)
  },[request,auth.token])

  const searchout = (search)=>{
    if(search===""){
      setScripts(allScripts)
      return
    }
    let array = allScripts.filter(item => item.name.indexOf(search)!==-1)
    setScripts(array)
  }

  useEffect(()=>{
    updataScripts()
  },[updataScripts])

  return(
    <>
      <AddScriptBase/>
      <div className = "conteiner top">
      <Header search={searchout} name="Scripts All">
      <Link to = "/scripts/add" className="btn"><i onClick={()=>{}} className="fas fa-plus"></i></Link>
      </Header>
        <div className = "Scripts">
          <div className="scriptsList">
            {
              (loading)?
              <Loader/>:
              (scripts&&scripts[0])?
              scripts.map((item,index)=>{
                return(
                  <ScriptElement key={index} script={item} updata={updataScripts}/>
                )
              }):
              <h2 className="empty">Not elements</h2>
            }
          </div>
        </div>
      </div>
    </>
  )
}
