import React, {useContext,useEffect,useState,useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {GroupCard} from '../components/groupCard'
import {SocketContext} from '../context/SocketContext'
import {AuthContext} from '../context/AuthContext.js'
import {MenuContext} from '../components/Menu/menuContext'
import {GroupFormState} from '../components/groupForm/groupFormState'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const GroupsPage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const [allGroups, setAllGroups] = useState([]);
  const {setData} = useContext(MenuContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const [groups, setGroups] = useState([]);
  const read = useRef(0)

  const getGroups = useCallback(async ()=>{
    let data = await request(`/api/group/all`, 'get', null,{Authorization: `Bearer ${auth.token}`})
    if(data)
      setAllGroups(data)
      setGroups(data)
  },[auth.token])

  useEffect(()=>{
    getGroups()
  },[getGroups])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const searchout = useCallback((data)=>{
    if(data===""){
      setGroups(allGroups)
      return
    }
    let array = allGroups.filter(item => item&&item.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
    setGroups(array)
  },[allGroups])

  useEffect(()=>{
    setData("Groups All",{
      specialAction:(auth.userLevel >= 3)?{
        type: "add",
        action:()=>history.push("/groups/add")
      }:null,
      search: searchout
    })
  },[setData, history, searchout, auth.userLevel])

  return(
    <GroupFormState>
      <div className = "conteiner top bottom">
        <div className = "Devices">
          {
            (!groups||groups.length === 0)?
            <h2 className="empty">Not elements</h2>:
            <div className = "CardConteiner">
              {
                groups.map((item,index)=>{
                  return <GroupCard group={item} updata={getGroups} key={index}/>
                })
              }
            </div>
          }
        </div>
      </div>
    </GroupFormState>
  )
}
