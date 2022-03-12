import React, {useContext,useEffect,useState,useRef, useCallback} from 'react'
import {useHistory,useParams} from 'react-router-dom'
import {NewDeviceElement} from '../components/newDeviceElement'
import {SocketContext} from '../context/SocketContext'
import {AuthContext} from '../context/AuthContext.js'
import {MenuContext} from '../components/Menu/menuContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const GroupsAddPage = () => {
  let {id} = useParams();
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {setData} = useContext(MenuContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [group, setGroup] = useState({
    name:"",
    systemName:"",
    devices:[]
  })
  const allDevices = useContext(SocketContext)

  const updata = (event)=>{
    setGroup({...group, [event.target.name]: event.target.value})
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    setData("Groups add")
  },[setData])

  const getGroups = useCallback(async (name)=>{
    let data = await request(`/api/group/get/${name}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(data)
      setGroup({
        name:data.name,
        systemName:data.systemName,
        devices:[]
      })
  },[auth.token])

  useEffect(()=>{
    if(id)
    {
      getGroups(id)
    }
  },[id, getGroups])

  const isInclude = (dev)=>{
    for (let item of group.devices) {
      if(item === dev.systemName)
        return true
    }
    return false
  }

  const addDevice = (dev)=>{
    let arr = group.devices.slice()
    arr.push(dev.systemName)
    setGroup({...group, devices: arr})
  }

  const deleteDevice = (dev)=>{
    let arr = group.devices.slice()
    arr = arr.filter((item)=>item !== dev.systemName)
    setGroup({...group, devices: arr})
  }

  const create = async ()=>{
    if(!group.name || !group.systemName) return ;
    if(id)
      await request(`/api/group/edit/${id}`, 'POST', group,{Authorization: `Bearer ${auth.token}`})
    else
      await request(`/api/group/add`, 'POST', group,{Authorization: `Bearer ${auth.token}`})
    history.push("/groups")
  }

  return(
      <div className = "fullScrinContainer color-normal">
        <div className="allFon">
        <div className="configElement">
          <div className="input-data">
            <input onChange={updata} required name="name" type="text" value={group.name}></input>
            <label>Name</label>
          </div>
        </div>
        <div className="configElement">
          <div className="input-data">
            <input onChange={updata} required name="systemName" type="text" value={group.systemName}></input>
            <label>System name</label>
          </div>
        </div>
          <div className="buttons">
            <button style={{marginLeft:"10px"}} className="highSelection button" onClick={create}>Next</button>
          </div>
        </div>
      </div>
  )
}
