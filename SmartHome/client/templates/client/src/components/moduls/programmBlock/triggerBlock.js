import React,{useState,useEffect,useContext,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'

export const TriggerBlock = ({deviceId,action,updata,index,el,block,deleteEl})=>{
  const [device, setDevice]=useState({})
  const {devices} = useContext(DeviceStatusContext)
  const [type,setType] = useState(action??"all")
  const [allTypes,setAllTypes] = useState([])

  const lookForDeviceById = useCallback((id)=>{
    let condidat = devices.filter((item)=>item.DeviceId===id)
    condidat = condidat[0]
    let array = []
    if(condidat){
      for (var item of condidat.DeviceConfig) {
        if(item.name){
          array.push(item.name)
        }
      }
    }
    setAllTypes(array)
    return condidat;
  },[devices])

  useEffect(()=>{
    setDevice(lookForDeviceById(deviceId))
  },[lookForDeviceById,deviceId])

  const changeSelector = event=>{
    setType(event.target.value)
    console.log(event.target.value);
    updata({index,action:event.target.value})
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        {(device)?device.DeviceName:"Name"}
      </div>
      <div className="programm-function-block-content-item">
        <select value={type} onChange={changeSelector} name="property">
          <option value="all">all</option>
          {
            allTypes.map((item,index)=>{
              return(
                <option key={index} value={item}>{item}</option>
              )
            })
          }
        </select>
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index,block)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
