import {useContext,useCallback} from 'react'
import {DialogWindowContext} from '../../dialogWindow/dialogWindowContext'
import {SocketContext} from '../../../context/SocketContext'
import {GroupsContext} from '../../Groups/groupsContext'

export const useScriptDevices = ()=>{
  const {devices} = useContext(SocketContext)
  const {groups} = useContext(GroupsContext)
  const dialog = useContext(DialogWindowContext)

  const filteredDevice = useCallback((type, typeDev)=>{
      let filteredDevs = devices.filter((item)=>{
        let flag = false
        for (var item2 of item.fields) {
          if(
            (typeDev==="number"&&(item2.type==="number"||item2.type==="binary"))||
            (typeDev==="binary"&&item2.type==="binary")||
            (typeDev==="text")||
            (typeDev==="enum"&&item2.type==="enum")||
            (!typeDev)
          )flag = true
          if(flag&&(type!=="act"||item2.control))
            return true
        }
        return false
      })
      return filteredDevs
  },[devices])

  const filteredGroup = useCallback((type, typeDev)=>{
      let filteredDevs = groups.filter((item)=>{
        let flag = false
        for (var item2 of item.fields) {
          if(
            (typeDev==="number"&&(item2.type==="number"||item2.type==="binary"))||
            (typeDev==="binary"&&item2.type==="binary")||
            (typeDev==="text")||
            (typeDev==="enum"&&item2.type==="enum")||
            (!typeDev)
          )flag = true
          if(flag&&(type!=="act"||item2.control))
            return true
        }
        return false
      })
      return filteredDevs
  },[groups])

  const deviceBlock = useCallback((result, type="act", typeDev = null)=>{
    let items = filteredDevice(type, typeDev).map((item)=>({title:item.name, data:item}))
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        if(typeof(result)==="function")
          result(d)
        dialog.hide()
      }
    })
  },[filteredDevice, dialog])

  const groupBlock = useCallback((result, type="act", typeDev = null)=>{
    let items = filteredGroup(type, typeDev).map((item)=>({title:item.name, data:item}))
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        if(typeof(result)==="function")
          result(d)
        dialog.hide()
      }
    })
  },[filteredGroup, dialog])

  return {deviceBlock, groupBlock}
}
