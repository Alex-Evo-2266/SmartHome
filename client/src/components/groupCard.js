import React, {useContext,useState,useEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {RunText} from './runText'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {Power} from './controlComponents/power'
import {Dimmer} from './controlComponents/dimmer'
import {Mode} from './controlComponents/mode'
import {Enum} from './controlComponents/enum'
import {Text} from './controlComponents/text'
import {Menu} from './Menu/dopmenu/menu'
import {GroupFormContext} from './groupForm/groupFormContext'
import {SocketContext} from '../context/SocketContext'
import {AuthContext} from '../context/AuthContext.js'

export const GroupCard = ({group, updata}) =>{
  const history = useHistory()
  const {devices, updateDevice} = useContext(SocketContext)
  const form = useContext(GroupFormContext)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [status,setStatus] = useState(true)

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const detailDevice = ()=>{
    if(group?.status === "online" && group?.value)
      history.push(`/group/ditail/${group.systemName}`)
  }

  const getValue = (name, type=null)=>{
    let val = 0
    let arr = []
    for (let item of group.devices) {
      arr.push(devices.filter(item2 => (item2&&item2.systemName===item))[0])
    }
    for (var item of arr) {
      if (!item || !item.value) continue
      val = item?.value[name]
    }
    return val
  }

  const getdevice = (names) => devices.filter((item)=>names.includes(item.systemName))

  const controlfield = fields => fields?.filter(item => item.control === true)

  const getValueField = (field)=>{
    let groupdevices = getdevice(group?.devices?.map(item=>item.name))
    return groupdevices?.filter(item=>!!item?.value[field])[0]?.value[field]
  }

  const getFields = ()=>{
    return group?.fields?.map(item=>({...item, value:getValueField(item.name)}))
  }

  const outValue = async(systemName, type, v)=>{
    await request('/api/group/value/set', 'POST', {systemName: systemName,type:type,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const editDevices = ()=>{
    form.show("deviceInGroup", group, async(_, group)=>{
      await request(`/api/group/device/edit/${group.systemName}`, 'POST', group,{Authorization: `Bearer ${auth.token}`})
      if(typeof(updata) === "function")
        updata()
    })
  }

  if(!group){
    return null
  }

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <RunText onClick={detailDevice} className="DeviceName" id={group.systemName} text={group.name||"NuN"}/>
        {
          (auth.userLevel >= 3)?
          <Menu buttons={[
            {
              title:"edit",
              onClick:()=>history.push(`/groups/edit/${group.systemName}`)
            },
            {
              title:"device",
              onClick:editDevices
            }
          ]}/>
          :null
        }
      </div>
      <div className="dividers"></div>
      <div className = "NewCardBody">
        <ul>
        {
          getFields().map((item,index)=>{
            if(item.type==="binary" && item.control){
              return <Power outValue={outValue} key={index} updata = {updateDevice} systemName={group.systemName} value={(String(item.value)==="1")?true:false} type={item.name}/>
            }
            if(item.type==="number"&& item.control){
              return <Dimmer outValue={outValue} key={index} updata = {updateDevice} systemName={group.systemName} value={Number(item.value)} type={item.name} title = {item.name} conf={{min:item.low,max:item.high}}/>
            }
            if(item.type==="number"&& item.control){
              return <Mode outValue={outValue} key={index} updata = {updateDevice} systemName={group.systemName} value={Number(item.value)} type={item.name} conf={Number(item.high)}/>
            }
            if(item.type==="enum"&& item.control){
              return <Enum outValue={outValue} key={index} updata = {updateDevice} systemName={group.systemName} value={item.value} type={item.name} conf={item.values}/>
            }
            if(item.type==="text"&& item.control){
              return <Text outValue={outValue} key={index} updata = {updateDevice} systemName={group.systemName} value={item.value} type={item.name} conf={item.values} title={item.name}/>
            }
            if(!item.control){
              return(
                <li className="DeviceControlLi" key={index}>
                  <div className="DeviceControlLiName">
                    <p>{item.name}</p>
                  </div>
                  <div className="DeviceControlLiContent">
                    <div className="DeviceControlLiValue">
                      <p>{getValue(item.name)}</p>
                    </div>
                  </div>
                </li>
              )
            }
            return null
          })
        }
        </ul>
      </div>
    </div>
  )
}
