import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook'
import { setTitle } from '../../store/reducers/menuReducer';
import { ChoiseDevicePage } from './AddDevicepages/ChoiseDevices';
import { FieldDevicePage } from './AddDevicepages/fieldDevice';

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
    token: ""
  })

  const getOptions = useCallback(async()=>{
    const data = await request("/api/devices/options", "GET", null, {Authorization: `Bearer ${auth.token}`})
    if(data && Array.isArray(data))
      setOptions(data)
  },[request, auth.token])

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

  return(
    <div className='container normal-color'>
		{
      (page === 1)?
      <ChoiseDevicePage options={options} setDevice={setDevice} next={()=>setPage(prev=>prev+1)}/>:
      (page === 2)?
      <FieldDevicePage options={options} device={device}/>:
      null
    }
    </div>
  )
}
