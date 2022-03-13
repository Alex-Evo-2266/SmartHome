import React, {useState, useCallback, useEffect} from 'react'
import {GroupsContext} from './groupsContext'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'

export const GroupsState = ({children, token}) =>{
  const [groups, setGroups] = useState([])
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const getGroups = useCallback(async()=>{
    if (!token) return ;
    let data = await request(`/api/group/all`, 'get', null,{Authorization: `Bearer ${token}`})
    if (data)
      setGroups(data)
  },[request, token])

  const getGroup = useCallback((name)=>{
    return groups.filter(item=>item.systemName === name)[0]
  },[groups])

  useEffect(()=>{
    getGroups()
  },[getGroups])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <GroupsContext.Provider
    value={{groups: groups, updata: getGroups, getGroup}}>
      {children}
    </GroupsContext.Provider>
  )
}
