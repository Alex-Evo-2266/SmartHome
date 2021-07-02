import React, {useContext,useEffect,useState,useRef,useCallback} from 'react'
import {NavLink,Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {Header} from '../components/moduls/header'
import {NewDeviceElement} from '../components/moduls/newDeviceElement'
import {AuthContext} from '../context/AuthContext.js'
import {DeviceStatusContext} from '../context/DeviceStatusContext'

export const ChartsPage = () => {
  const allDevices = useContext(DeviceStatusContext)
  const auth = useContext(AuthContext)
  const {request, error, clearError} = useHttp();
  const [charts,setCharts] = useState()

  const importCharts = useCallback(async()=>{
    try {
      const data = await request(`/api/charts/get`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setCharts(data)
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  useEffect(()=>{
    importCharts()
  },[importCharts])

  useEffect(()=>{
    console.log(charts);
  },[charts])

  const searchout = (data)=>{

  }

  return(
      <div className = "conteiner top bottom">
        <Header search={searchout} name="Charts">
        </Header>
        <div className = "Charts">

        </div>
      </div>
  )
}
