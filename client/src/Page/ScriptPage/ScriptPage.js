import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { Table } from '../../components/table/table'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
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

  useEffect(()=>getScripts(),[getScripts])

  const getTrigger = useCallback((trigger)=>trigger.trigger.map(item=>`${item.arg1}.${item.arg2}`),[])

  const getFields = useCallback(()=>{
    let arr = []
    scripts.forEach(item => {
      arr.push({data:{
        title: item.name,
        trigger: JSON.stringify(getTrigger(item.trigger)),
        action: {title: "action", onClick: ()=>{console.log(item)}},
        edit: {title: "edit", onClick: ()=>history.push(`/scripts/edit/${item.name}`)},
        delete: {title: "delete", onClick: ()=>{console.log(item)}},
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
				{title: "delete", type: "btn", name: "delete"}
			]} items={getFields()}/>
        {
		    (auth.role === "admin")?
		    <NavLink className='fab-btn' to="/scripts/add">+</NavLink>:
		    null
		}
    </div>
  )
}
