import {useCallback, useContext, useEffect} from 'react'
import {useDecodePath} from './pathDecodhook'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {useParams} from 'react-router-dom'
import {FormContext} from '../../components/Form/formContext'
import {TypeDeviceContext} from '../../components/typeDevices/typeDevicesContext.js'
import {DialogWindowContext} from '../../components/dialogWindow/dialogWindowContext'

export const useMenuModuls = () => {
  const {getfields} = useDecodePath()
  const {show} = useContext(DialogWindowContext)
  const types = useContext(TypeDeviceContext)
  const form = useContext(FormContext)
  let {name} = useParams();
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  const typeList = useCallback(()=>types?.type?.map(item=>{
    return {
      title: item.title,
      data: item.title,
    }
  }),[types])

  const clickmenu = useCallback(async(config, root, update)=>{
    console.log(config,name);
    for (let item of config) {
      if(item.type === "update")
        update()
      else if(item.type === "request"){
        await request(item.address, item.method, item.body,{Authorization: `Bearer ${auth.token}`})
      }
      else if(item.type === "linc" && name && root){
        const device = await request(`/api/page/linc/device/${name}`, "POST", {device:root},{Authorization: `Bearer ${auth.token}`})
        show("confirmation",{
          title:"Types",
          items:typeList(),
          active:(ret)=>{
            form.show("LinkDevices",null,{...device, type: ret})
          }
        })
      }
      else{}
    }
  },[auth.token,request,name,typeList,show,form])

  const getmenu = useCallback((config, root, update)=>{
    if(!(config?.menu)) return ;
    let arr = []
    for (let item of config.menu) {
      arr.push({
        title:getfields(item.title,root),
        onClick:()=>clickmenu(item.action, root, update),
        active:false
      })
    }
    return arr
  },[clickmenu,getfields])

  return {getmenu}
}
