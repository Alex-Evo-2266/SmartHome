import {useContext,useCallback} from 'react'
import {DialogWindowContext} from '../../dialogWindow/dialogWindowContext'
import {SocketContext} from '../../../context/SocketContext'

export const useScriptDevices = ()=>{
  const {devices} = useContext(SocketContext)
  const dialog = useContext(DialogWindowContext)

  const filtered = useCallback((type, typeDev)=>{
      let filteredDevs = devices.filter((item)=>{
        let flag = false
        for (var item2 of item.config) {
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

  const deviceBlock = useCallback((result, type="act", typeDev = null)=>{
    let items = filtered(type, typeDev).map((item)=>({title:item.name, data:item}))
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        if(typeof(result)==="function")
          result(d)
        dialog.hide()
      }
    })
  },[filtered, dialog])

  return {deviceBlock}
}
