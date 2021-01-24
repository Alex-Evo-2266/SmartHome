import React,{useState,useEffect,useContext,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'

export const TriggerBlock = ({deviceId,type,updata,index,el,block,deleteEl})=>{
  const [device, setDevice]=useState({})
  const {devices} = useContext(DeviceStatusContext)


  const lookForDeviceById = useCallback((id)=>{
    let condidat = devices.filter((item)=>item.DeviceId===id)
    return condidat[0];
  },[devices])

  useEffect(()=>{
    setDevice(lookForDeviceById(deviceId))
  },[lookForDeviceById,deviceId])

  return(
    <div className="actBlock">
      <div className="deviceBlock">
        <div className="nameBlock">
          {(device)?device.DeviceName:"Name"}
        </div>
      </div>
      <div className="deleteBlock" onClick={()=>{deleteEl(index,block)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
