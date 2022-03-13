import React,{useEffect,useState,useCallback} from 'react'
import {TypeDeviceContext} from './typeDevicesContext'
import {useHttp} from '../../hooks/http.hook'

export const TypesDeviceState = ({children, token, ready}) =>{
  const {request} = useHttp();
  const [types, setTypes] = useState([])

  const gettypes = useCallback(async()=>{
    try {
      const data = await request(`/api/device/types/get`, 'GET', null,{Authorization: `Bearer ${token}`})
      setTypes(data)
    } catch (e) {
      console.error(e)
    }
  },[request,token])

  useEffect(()=>{
    if(ready){
      gettypes()
    }
  },[ready,gettypes])

  return(
    <TypeDeviceContext.Provider value={{type:types}}>
      {children}
    </TypeDeviceContext.Provider>
  )
}
