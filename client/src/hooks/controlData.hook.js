import {useState, useCallback, useContext} from 'react'
import {SocketContext} from '../context/SocketContext'
import {GroupsContext} from '../components/Groups/groupsContext'

const foo = ()=>{}

export const useControlData = ()=>{
  const {getDevice} = useContext(SocketContext)
  const {getGroup} = useContext(GroupsContext)

  const itemField = useCallback((fields, name)=>{
    return fields?.filter(item=>item.name===name)[0]
  },[])

  const getGroupValue = useCallback((group, field)=>{
    for (var item of group.devices) {
      let dev = getDevice(item.name)
      let val = dev?.value[field]
      if(val)
        return val
    }
  },[getDevice])

  const convert = useCallback((data, editmode)=>{
    let res = {}
    res.data = data
    res.disabled = false
    res.title = data.title
    res.editmode = editmode
    if(data.typeItem === "script")
      return res
    else if(data.typeItem === "device")
    {
      res.entity = getDevice(data.deviceName)
      res.fieldsEntity = res.entity?.config
      res.field = itemField(res.fieldsEntity, data.typeAction)
      res.fieldvalue = res.entity?.value[res.field?.name]
    }
    else if(data.typeItem === "group")
    {
      res.entity = getGroup(data.deviceName)
      res.fieldsEntity = res.entity?.fields
      res.field = itemField(res.fieldsEntity, data.typeAction)
      res.fieldvalue = getGroupValue(res.entity, res.field?.name)
    }
    if(!res.entity || !res.fieldsEntity || !res.field)
      res.disabled = true
    if(res.entity?.status && res.entity?.status!="online")
      res.disabled = true
    return res
  },[getDevice, getGroupValue, itemField, getGroup])
  return {convert}
}
