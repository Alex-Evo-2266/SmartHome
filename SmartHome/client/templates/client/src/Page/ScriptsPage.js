import React,{useState,useEffect,useCallback,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {Loader} from '../components/Loader'
import {ScriptElement} from '../components/scriptCarts/scriptElement'
import {MenuContext} from '../components/Menu/menuContext'
import {AddScriptBase} from '../components/addScript/addScriptBase'

export const ScriptsPage = () => {
  const [scripts, setScripts] = useState([])
  const history = useHistory()
  const [allScripts, setAllScripts] = useState([])
  const auth = useContext(AuthContext)
  const {setData} = useContext(MenuContext)
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
    setScripts(data);
    setAllScripts(data)
  },[request,auth.token])

  const searchout = useCallback((search)=>{
    if(search===""){
      setScripts(allScripts)
      return
    }
    let array = allScripts.filter(item => item.name.indexOf(search)!==-1)
    setScripts(array)
  },[allScripts])

  useEffect(()=>{
    setData("Scripts All",{
      specialAction:(auth.userLevel >= 3)?{
        type: "add",
        action:()=>history.push("/scripts/add")
      }:null,
      search: searchout
    })
  },[setData, searchout, history])

  useEffect(()=>{
    updataScripts()
  },[updataScripts])

  return(
    <>
      <AddScriptBase/>
      <div className = "conteiner top bottom">
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
