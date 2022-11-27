import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook'
import { setTitle } from '../../store/reducers/menuReducer';
import { ChoiseDevicePage } from './AddDevicepages/ChoiseDevices';
import { FieldDevicePage } from './AddDevicepages/fieldDevice';
import { NameDevicePage } from './AddDevicepages/nameDevice';

export const AddDevicePage = () => {

  const dispatch = useDispatch()
  const {message} = useMessage();
  const auth = useSelector(state=>state.auth)
  const {request, error, clearError} = useHttp();
  const [options, setOptions] = useState([])
  const [page, setPage] = useState(1)
  const [device, setDevice] = useState({
    type: "",
    class_device: "",
    value_type: "json",
    name: "",
    system_name: "",
    address: "",
    token: "",
    fields:[]
  })

  const getOptions = useCallback(async()=>{
    const data = await request("/api/devices/options", "GET", null, {Authorization: `Bearer ${auth.token}`})
    if(data && Array.isArray(data))
      setOptions(data)
  },[request, auth.token])

  const getOptionsDevice = useCallback(()=>{
    if(device.class_device)
    {
      let d = options.filter((item)=>item.class_name === device.class_device)
      return d[0]
    }
  },[options, device])

  useEffect(()=>{
    getOptions()
  },[getOptions])

  useEffect(()=>{
    message(error, 'error');
    clearError();
    return ()=>clearError()
  },[error, message, clearError])

  useEffect(()=>{
    dispatch(setTitle("Add devices"))
  },[dispatch])

  useEffect(()=>{
    console.log(device)
  },[device])

  const validFields = (field)=>{
    if (field.type === "")
      return false
    if (field.name === "")
      return false
    if (field.low === "" && (field.type === "binary" || field.type === "number"))
      return false
    if (field.high === "" && (field.type === "binary" || field.type === "number")) 
      return false
    if (field.enum_values === "" && field.type === "enum") 
      return false
    if (getOptionsDevice().added.address && field.address === "")
      return false
    return true
  }

  const valid = ()=>{
    if (device.type === "")
      return false
    if (device.class_device === "")
      return false
    if (device.value_type === "")
      return false
    if (device.name === "" || device.system_name === "")
      return false
    if (getOptionsDevice().added.address && device.address === "")
      return false
    if (getOptionsDevice().added.token && device.token === "")
      return false
    for (const item of device.fields) {
      if (!validFields(item)) return false
    }
    return true
  }

  const out = async()=>{
    if(valid())
    {
      try{
        let data = await request("/api/devices", "POST", device, {Authorization: `Bearer ${auth.token}`})
        if(data)
        {
          let path = window.location.pathname
          path = path.split('/')
          path = path.slice(0,-1)
          path = path.join('/')
          window.location = path
        }
      }
      catch{}
    }
    else
      message("invalid entered data", 'error');
  }

  return(
    <div className='container normal-color'>
		{
      (page === 1)?
      <ChoiseDevicePage options={options} setDevice={setDevice} next={()=>setPage(prev=>prev+1)}/>:
      (page === 2)?
      <FieldDevicePage setDevice={setDevice} options={getOptionsDevice().added} device={device} next={()=>setPage(prev=>prev+1)} prev={()=>setPage(prev=>prev-1)}/>:
      (page === 3)?
      <NameDevicePage setDevice={setDevice} options={getOptionsDevice().added} device={device} next={out} prev={()=>setPage(prev=>prev-1)}/>:
      null
    }
    </div>
  )
}
