import React from 'react'
import {Chart} from './chartElement'
import {generateDatabyDevice} from './utils'


export const DeviceChart = ({data,device})=>{

  if(!data.lines[device.DeviceSystemName])
  return null

  return (
    <div className="device-chart-card">
      <Chart data={generateDatabyDevice(data,device.DeviceSystemName)}/>
    </div>
  )
}
