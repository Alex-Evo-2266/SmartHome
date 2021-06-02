import React,{useContext,useState,useEffect,useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {SelectioEnlementImg} from '../components/addDeviceComponent/selectioEnlementImg'
import {DeviceMqtt} from '../components/addDeviceComponent/config/mqttDevices'
import {AnimationLi} from '../components/animationLi.js'
import {useHttp} from '../hooks/http.hook'
import {useChecked} from '../hooks/checked.hook'
import {useMessage} from '../hooks/message.hook'
import imgMiio from '../img/miio.png';
import imgMqtt from '../img/mqtt.png';
import imgLight from '../img/lightDevices.jpg';
import imgDimmer from '../img/dimmerDevices.jpg';
import imgOther from '../img/otherDevice.jpg';
import imgSensor from '../img/sensorDevices.jpg';
import imgSwitch from '../img/switchDevices.jpg';
import imgVariable from '../img/variable.png'
import imgYeelight from '../img/yeelight.jpg'
import imgJSON from '../img/json.png'
import imgValue from '../img/val.png'

export const AddDevicesPage = () => {
  const auth = useContext(AuthContext)
  const history = useHistory()
  const {USText} = useChecked()
  const {message, clearMessage} = useMessage();
  const {request, error, clearError} = useHttp();
  const [form, setForm] = useState({
    DeviceTypeConnect: '',
    DeviceType: '',
    DeviceValueType: 'json',
    DeviceName: '',
    DeviceAddress:'',
    DeviceSystemName:'',
    config:[],
    DeviceToken:''
  });

  useEffect(()=>{
    console.log(form);
  },[form])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const validFields = ()=>{
    let arrType = []
    for (var item of form.config) {
      for (var item2 of arrType) {
        if(item.type === item2){
          message("повторяющиеся поля","error")
          return false
        }
      }
      arrType.push(item.type)
    }
    return true
  }

  const outHandler = async () => {
    // if(DeviceTypeConnect)
    try {
      clearMessage();
      console.log(form);
      if(!validFields())
        return
      const data = await request('/api/devices', 'POST', {...form},{Authorization: `Bearer ${auth.token}`})
      console.log(data);
      if(data){
        history.push('/devices')
      }
    } catch (e) {

    }
  }


  const typeConnectHandler = event => {
    if(event.target.title === "variable")
      setForm({ ...form, DeviceTypeConnect: "system",DeviceType: event.target.title,config:[
        {
          address:"",
          type:"value",
          icon:"",
          typeControl:"text"
        }
      ]})
    else if(form.DeviceType==="variable")
      setForm({ ...form, DeviceTypeConnect: event.target.title,DeviceType: "" })
    else
      setForm({ ...form, DeviceTypeConnect: event.target.title })

  }

  const typeDeviceHandler = async event => {
      await setForm({ ...form, DeviceType: event.target.title})
  }

  const typeValueHandler = async event => {
      await setForm({ ...form, DeviceValueType: event.target.title})
  }
  const tokenHandler = async event => {
      await setForm({ ...form, DeviceToken: event.target.value})
  }

  const confHandler = useCallback((confs) => {
    setForm((prev)=> {
      return { ...prev, config: confs}
    })
  },[])

  const changeHandler = event => {
    if(event.target.name==="DeviceType"&&event.target.value==="variable"){
      setForm({ ...form,DeviceType:"variable", DeviceTypeConnect: "system",config:[
        {
          address:"",
          type:"value",
          icon:"",
          typeControl:"text"
        }
      ]})
      return
    }
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const changeHandlerTest = event=>{
    if(USText(event.target.value)){
      changeHandler(event)
      return ;
    }
    message("forbidden symbols","error")
  }

  return(
    <div className = "conteiner slide-conteiner">
      <div className="conteiner-head">
        <h2>Adding devices</h2>
      </div>
      <div className="conteiner-body">
        <ul className="conteiner-body-ul">
          <li className="conteiner-body-li">
            <label>
              <h5>Enter the device name</h5>
              <input className = "textInput" placeholder="name" id="DeviceName" type="text" name="DeviceName" value={form.DeviceName} onChange={changeHandler} required/>
            </label>
          </li>
          <li className="conteiner-body-li">
            <label>
              <h5>Enter the device System name</h5>
              <input className = "textInput" placeholder="system name" id="DeviceSystemName" type="text" name="DeviceSystemName" value={form.DeviceSystemName} onChange={changeHandlerTest} required/>
            </label>
          </li>
          <AnimationLi className="conteiner-body-li" show={form.DeviceSystemName&&form.DeviceName}>
            <ul className="selectioEnlementUl">
              <li>
                <SelectioEnlementImg active={(form.DeviceTypeConnect==="miio")} onClick={typeConnectHandler} width="100px" height="100px" title = "Miio device" name="miio" src={imgMiio}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.DeviceTypeConnect==="yeelight")} onClick={typeConnectHandler} width="100px" height="100px" title = "Yeelight device" name="yeelight" src={imgYeelight}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.DeviceTypeConnect==="mqtt")} onClick={typeConnectHandler} width="100px" height="100px" title="Mqtt device" name="mqtt" src={imgMqtt}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.DeviceTypeConnect==="system")} onClick={typeConnectHandler} width="100px" height="100px" title="variable" name="variable" src={imgVariable}/>
              </li>
            </ul>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.DeviceSystemName&&form.DeviceName&&form.DeviceTypeConnect&&form.DeviceTypeConnect!=="system"}>
            <label>
              <h5>Enter the device address</h5>
              <input className = "textInput" placeholder="address" id="DeviceAddress" type="text" name="DeviceAddress" value={form.DeviceAddress} onChange={changeHandler} required/>
            </label>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.DeviceSystemName&&form.DeviceName&&form.DeviceTypeConnect&&form.DeviceTypeConnect!=="system"&&form.DeviceAddress}>
            <ul className="selectioEnlementUl">
            {
              (form.DeviceTypeConnect==="yeelight"||form.DeviceTypeConnect==="mqtt"||form.DeviceTypeConnect==="miio")?
              <li>
                <SelectioEnlementImg active={(form.DeviceType==="light")} onClick={typeDeviceHandler} width="100px" height="100px" title = "light device" name="light" src={imgLight}/>
              </li>
              :null
            }
            {
              (form.DeviceTypeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.DeviceType==="relay")} onClick={typeDeviceHandler} width="100px" height="100px" title="relay device" name="relay" src={imgSwitch}/>
              </li>
              :null
            }
            {
              (form.DeviceTypeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.DeviceType==="dimmer")} onClick={typeDeviceHandler} width="100px" height="100px" title = "dimmer device" name="dimmer" src={imgDimmer}/>
              </li>
              :null
            }
            {
              (form.DeviceTypeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.DeviceType==="sensor")} onClick={typeDeviceHandler} width="100px" height="100px" title="sensor device" name="sensor" src={imgSensor}/>
              </li>
              :null
            }
            {
              (form.DeviceTypeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.DeviceType==="other")} onClick={typeDeviceHandler} width="100px" height="100px" title="other device" name="other" src={imgOther}/>
              </li>
              :null
            }
            </ul>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.DeviceSystemName&&form.DeviceName&&form.DeviceTypeConnect&&form.DeviceType&&form.DeviceTypeConnect!=="system"&&form.DeviceTypeConnect==="mqtt"}>
            <ul className="selectioEnlementUl">
              <li>
                <SelectioEnlementImg active={(form.DeviceValueType==="json")} onClick={typeValueHandler} width="100px" height="100px" title = "json" name="json" src={imgJSON}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.DeviceValueType==="value")} onClick={typeValueHandler} width="100px" height="100px" title = "value" name="value" src={imgValue}/>
              </li>
            </ul>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.DeviceSystemName&&form.DeviceName&&form.DeviceType&&form.DeviceType!=="variable"}>
            {
              (form.DeviceTypeConnect==="mqtt")?
              <DeviceMqtt onChange={confHandler} type={form.DeviceType}/>:
              (form.DeviceTypeConnect==="miio")?
              <label>
                <h5>Enter the device token</h5>
                <input className = "textInput" placeholder="token" id="DeviceToken" type="text" name="DeviceToken" value={form.DeviceToken} onChange={tokenHandler} required/>
              </label>
              :null
            }
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.DeviceSystemName&&form.DeviceName&&form.DeviceAddress&&form.DeviceType&&(form.DeviceTypeConnect==="yeelight"||form.DeviceType==="variable"||(form.DeviceTypeConnect==="miio"&&form.DeviceToken)||(form.DeviceTypeConnect&&form.config[0]&&form.config[0].address))}>
            <button className="btnOut" onClick={outHandler}>Save</button>
          </AnimationLi>
        </ul>
      </div>
    </div>
  )
}
