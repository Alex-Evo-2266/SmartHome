import React,{useEffect,useState,useCallback,useContext} from 'react'
import {TypeDeviceContext} from './typeDevicesContext'
import {useHttp} from '../../hooks/http.hook'

export const TypesDeviceState = ({children, token, ready}) =>{
  const {request, error, clearError} = useHttp();
  const [types, setTypes] = useState([])
  const [flag, setFlag] = useState(true)

  const gettypes = useCallback(async()=>{
    try {
      const data = await request(`/api/devices/types`, 'GET', null,{Authorization: `Bearer ${token}`})
      console.log(data)
      setTypes(data)
      setFlag(false)
    } catch (e) {
      console.error(e)
    }
  },[request,token])

  useEffect(()=>{
    if(ready && flag){
      gettypes()
    }
  },[ready,gettypes, flag])

  return(
    <TypeDeviceContext.Provider value={{type:types}}>
      {children}
    </TypeDeviceContext.Provider>
  )
}
