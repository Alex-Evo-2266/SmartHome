import React, {useRef,useEffect} from 'react'
import {useChart} from './chart'


export const Chart = ({data})=>{
  const canvas = useRef(null)
  const {chart} = useChart()

  useEffect(()=>{
    let control = null
    if(data){
      control = chart(canvas.current,data)
      control.init()
    }
    return ()=>{
      if(control) {
        control.destroy()
      }
    }
  },[chart,data])

  return (
    <div className="chartCart">
      <div className="chartContent" ref={canvas}>
        <div data-el="tooltip" className="chart-tooltip"></div>
        <canvas className="chart"></canvas>
      </div>
    </div>
  )
}
