import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { SUCCESS } from '../../components/alerts/alertTyps'
import { Table } from '../../components/table/table'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { showAlertDialog } from '../../store/reducers/dialogReducer'
import { setTitle } from '../../store/reducers/menuReducer'

// const cardsList = [
//   {
//     title:"base card",
//     data:"base"
//   },
//   {
//     title:"list card",
//     data:"line"
//   },
// ]

export const ScriptPage = () => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)
  const [scripts, setScripts] = useState([])
  const {request, error, clearError} = useHttp()
	const {message} = useMessage()
  const history = useHistory()

  useEffect(()=>{
    dispatch(setTitle("Scripts"))
  },[dispatch])

  useEffect(()=>{
    console.log(scripts)
  },[scripts])

  useEffect(()=>{
		message(error,"error")
		return ()=>{
			clearError();
		}
	},[error,message, clearError])

  const getScripts = useCallback(async()=>{
    let data = await request("/api/scripts", "GET", null, {Authorization: `Bearer ${auth.token}`})
    if (data && Array.isArray(data))
      setScripts(data)
  },[request])

  const activateScript = useCallback(async(scriptName)=>{
    let data = await request(`/api/scripts/${scriptName}/activate`, "GET", null, {Authorization: `Bearer ${auth.token}`})
    if (data == "ok")
      message("script activated", SUCCESS)
  },[request])

  const deleteScript = useCallback(async(scriptName)=>{
    dispatch(showAlertDialog("delete script", "delete script?", [{title:"ok", action: async()=>{
      await request(`/api/scripts/${scriptName}`, "DELETE", null, {Authorization: `Bearer ${auth.token}`})
      getScripts()
    }}]))
  },[getScripts, request, dispatch])

  useEffect(()=>getScripts(),[getScripts])

  const getTrigger = useCallback((trigger)=>trigger.trigger.map(item=>`${item.arg1}.${item.arg2}`),[])

  const getFields = useCallback(()=>{
    let arr = []
    scripts.forEach(item => {
      arr.push({data:{
        title: item.name,
        trigger: JSON.stringify(getTrigger(item.trigger)),
        action: {title: "action", onClick: ()=>activateScript(item.name)},
        edit: {title: "edit", onClick: ()=>history.push(`/scripts/edit/${item.name}`)},
        delete: {title: "fa fa-trash", color:"red", onClick: ()=>deleteScript(item.name)},
      }})
    })
    return arr
  },[scripts])

  return(
    <div className='container'>
      <Table col={[
				{title: "title",name: "title"},
				{title: "trigger", name:"trigger"},
				{title: "action", type: "btn", name:"action"},
				{title: "edit", type: "btn", name: "edit"},
				{title: "delete", type: "btn-icon", name: "delete"}
			]} items={getFields()}/>
        {
		    (auth.role === "admin")?
		    <NavLink className='fab-btn' to="/scripts/add">+</NavLink>:
		    null
		}
    </div>
  )
}
