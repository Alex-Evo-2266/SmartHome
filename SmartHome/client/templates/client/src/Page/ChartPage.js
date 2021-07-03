import React, {useContext,useEffect,useState,useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Header} from '../components/moduls/header'
import {AuthContext} from '../context/AuthContext.js'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {DeviceChart} from  '../components/chart/DeviceChart'

const corectedData=(data)=>{
  let datetimes = data.charts.time_line.slice()
  let oldDate = null
  for (var i = 0; i < datetimes.length; i++) {
    if(oldDate&&datetimes[i] - oldDate !== 500){
      let newTime = datetimes[i]
      newTime=newTime-500
      let index = data.charts.time_line.indexOf(datetimes[i])
      for (var key in data.charts.lines) {
        for (var key2 in data.charts.lines[key]) {
          let el = data.charts.lines[key][key2][index-1]
          data.charts.lines[key][key2].splice(index,0,el)
        }
      }
      data.charts.time_line.splice(index,0,newTime)
    }
    oldDate = datetimes[i]
  }
  return data.charts
}

export const ChartsPage = () => {
  const {devices} = useContext(DeviceStatusContext)
  const auth = useContext(AuthContext)
  const {request} = useHttp();
  const [charts,setCharts] = useState()

  const importCharts = useCallback(async()=>{
    try {
      const data = await request(`/api/charts/get`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setCharts(corectedData(data))
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

  if(!charts){
    return null;
  }

  return(
      <div className = "conteiner top bottom">
        <Header search={searchout} name="Charts">
        </Header>
        <div className = "Charts">
          {
            (devices)?
            devices.map((item,index)=>{
              return <DeviceChart data={charts} device={item} key={index}/>
            })
            :null
          }
        </div>
      </div>
  )
}
