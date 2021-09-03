import React,{useState} from 'react'
import {getOption} from './utils'
import {NoContent} from './scrins/noContent'
import {HistoryList} from './scrins/HistoryList'

import {CanvasJSChart} from 'canvasjs-react-charts'


export const DeviceHistory = ({data,device})=>{
  const [chartData,setChartData] = useState({})

  // <CanvasJSChart/>
  function lookforField(fields,name) {
    for (var item of fields) {
      if(item.name===name)
        return item
    }
  }

  function stringArreyToNumberArrey(arr) {
    try {
      let newArr = []
      for (var item of arr) {
        newArr.push({x:new Date(item.date), y:Number(item.value)})
      }
      return newArr
    } catch (e) {
      console.error(e);
    }
  }

  function stringArrey(arr) {
    try {
      let newArr = []
      for (var item of arr) {
        newArr.push({x:new Date(item.date), y:item.value})
      }
      return newArr
    } catch (e) {
      console.error(e);
    }
  }

  function clickField(event) {
    const d = data[device.DeviceSystemName][event.target.dataset.name]
    const field = lookforField(device?.DeviceConfig,event.target.dataset.name)
    if(!d||!field){
      setChartData({
        name:field.name,
        type:null,
      })
      return;
    }
    if(d&&(field.type==="binary"||field.type==="number")){
      setChartData({
        name:field.name,
        deviceName:device?.DeviceName,
        type:field.type,
        data:stringArreyToNumberArrey(d)
      })
    }
    else{
      setChartData({
        name:field.name,
        deviceName:device?.DeviceName,
        type:field.type,
        data:stringArrey(d)
      })
    }
  }
console.log(data);

  if(!data[device.DeviceSystemName])
  return null

  return (
    <div className="device-chart-card">
      <div className="content">
      <div className="canvasConteiner">
      {
        (chartData.type==="binary"||chartData.type==="number")?
        <CanvasJSChart options={getOption(chartData)}/>:
        (chartData.type)?
        <HistoryList data={chartData}/>:
        <NoContent/>
      }
      </div>
      <div className="controlCanvasConteiner">
        <h2>{device.DeviceName}</h2>
        <ul className="ChartZoom">
          <li>All</li>
          <li>Year</li>
          <li>Mount</li>
          <li>Day</li>
        </ul>
        {
          device?.DeviceConfig?.map((item,index)=>(
            <div className="field" key={index}>
              <button className={`${(chartData.name === item.name)?'active':''}`} onClick={clickField} data-name={item.name}>{item.name}</button>
            </div>
          ))
        }
      </div>
      </div>
    </div>
  )
}
