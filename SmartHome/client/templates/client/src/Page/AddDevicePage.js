import React,{useContext,useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {MenuContext} from '../components/Menu/menuContext'
import {AddDevicesPage1} from './AddDeviceComponents/page1'
import {AddDevicesPage2MQTT} from './AddDeviceComponents/page2Mqtt'
import {AddDevicesPage2Yeelight} from './AddDeviceComponents/page2Yeelight'
import {AddDevicesPage2Zigbee} from './AddDeviceComponents/page2Zigbee'
import {AddDevicesPage2Variable} from './AddDeviceComponents/page2Variable'
import {AddDevicesPage3} from './AddDeviceComponents/page3'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const AddDevicesPage = () => {
  const auth = useContext(AuthContext)
  const {setData} = useContext(MenuContext)
  const history = useHistory()
  const {clearMessage} = useMessage();
  const {request} = useHttp();
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({
    typeConnect: '',
    type: '',
    valueType: 'json',
    name: '',
    address:'',
    systemName:'',
    config:[],
    token:''
  });

  useEffect(()=>{
    setData("Add device")
  },[setData])

  const next = ()=>setPage(prev=>prev + 1)

  const outHandler = async () => {
    try {
      clearMessage();
      const data = await request('/api/devices', 'POST', {...form},{Authorization: `Bearer ${auth.token}`})
      if(data){
        history.push('/devices')
      }
    } catch (e) {

    }
  }

  const backPage = ()=>setPage(prev=>prev - 1)

  return(
    <div className = {`fullScrinContainer bottom ${(page === 1)?"addDevice":""}`}>
    {
      (page === 1)?
      <AddDevicesPage1 form={form} setForm={setForm} backPage={backPage} next={next}/>:
      (page === 2 && form.typeConnect === "mqtt")?
      <AddDevicesPage2MQTT form={form} setForm={setForm} backPage={backPage} next={next}/>:
      (page === 2 && (form.typeConnect === "yeelight"))?
      <AddDevicesPage2Yeelight form={form} setForm={setForm} backPage={backPage} next={next}/>:
      (page === 2 && (form.typeConnect === "zigbee"))?
      <AddDevicesPage2Zigbee form={form} setForm={setForm} backPage={backPage} next={next}/>:
      (page === 2 && (form.typeConnect === "variable"))?
      <AddDevicesPage2Variable form={form} setForm={setForm} backPage={backPage} next={next}/>:
      (page === 3)?
      <AddDevicesPage3 form={form} setForm={setForm} backPage={backPage} next={outHandler}/>:
      null
    }
    </div>
  )
}
