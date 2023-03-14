import React, {useContext,useEffect,useState, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {GroupCard} from '../components/groupCard'
import {AuthContext} from '../context/AuthContext.js'
import {MenuContext} from '../components/Menu/menuContext'
import {GroupsContext} from '../components/Groups/groupsContext'
import {GroupFormState} from '../components/groupForm/groupFormState'

export const GroupsPage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {updata, groups} = useContext(GroupsContext)
  const [allGroups, setAllGroups] = useState([]);
  const {setData} = useContext(MenuContext)

  const [groupsc, setGroups] = useState([]);

  useEffect(()=>{
    setAllGroups(groups)
    setGroups(groups)
  },[groups])

  useEffect(()=>{
    updata()
  },[updata])

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
            (!groupsc||groupsc.length === 0)?
            <h2 className="empty">Not elements</h2>:
            <div className = "CardConteiner">
              {
                groupsc.map((item,index)=>{
                  return <GroupCard group={item} updata={updata} key={index}/>
                })
              }
            </div>
          }
        </div>
      </div>
    </GroupFormState>
  )
}
