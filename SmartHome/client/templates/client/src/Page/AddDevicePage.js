import React,{useContext,useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {SelectioEnlementImg} from '../components/addDeviceComponent/selectioEnlementImg'
import {LightMqtt} from '../components/addDeviceComponent/config/mqttLamp'
import {RelayMqtt} from '../components/addDeviceComponent/config/mqttRelay'
import {DimmerMqtt} from '../components/addDeviceComponent/config/mqttDimmer'
import {SensorMqtt} from '../components/addDeviceComponent/config/mqttSensor'
import {OtherMqtt} from '../components/addDeviceComponent/config/mqttOther'
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
import imgBinarySensor from '../img/binarySensorDevices.jpg';
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
    typeConnect: '',
    typeDevice: '',
    typeValue: 'json',
    name: '',
    address:'',
    systemName:'',
    config:[],
    token:''
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

  const outHandler = async () => {
    // if(typeConnect)
    try {
      clearMessage();
      console.log(form);
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
      setForm({ ...form, typeConnect: "system",typeDevice: event.target.title })
    else if(form.typeDevice==="variable")
      setForm({ ...form, typeConnect: event.target.title,typeDevice: "" })
    else
      setForm({ ...form, typeConnect: event.target.title })

  }

  const typeDeviceHandler = async event => {
      await setForm({ ...form, typeDevice: event.target.title})
  }

  const typeValueHandler = async event => {
      await setForm({ ...form, typeValue: event.target.title})
  }
  const tokenHandler = async event => {
      await setForm({ ...form, token: event.target.value})
  }

  const confHandler = confs => {
    setForm({ ...form, config: confs})
  }

  const changeHandler = event => {
    if(event.target.name==="typeDevice"&&event.target.value==="variable"){
      setForm({ ...form,typeDevice:"variable", typeConnect: "system"})
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
              <input className = "textInput" placeholder="name" id="name" type="text" name="name" value={form.name} onChange={changeHandler} required/>
            </label>
          </li>
          <li className="conteiner-body-li">
            <label>
              <h5>Enter the device System name</h5>
              <input className = "textInput" placeholder="system name" id="SystemName" type="text" name="systemName" value={form.sysyemName} onChange={changeHandlerTest} required/>
            </label>
          </li>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name}>
            <ul className="selectioEnlementUl">
              <li>
                <SelectioEnlementImg active={(form.typeConnect==="miio")} onClick={typeConnectHandler} width="100px" height="100px" title = "Miio device" name="miio" src={imgMiio}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.typeConnect==="yeelight")} onClick={typeConnectHandler} width="100px" height="100px" title = "Yeelight device" name="yeelight" src={imgYeelight}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.typeConnect==="mqtt")} onClick={typeConnectHandler} width="100px" height="100px" title="Mqtt device" name="mqtt" src={imgMqtt}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.typeConnect==="system")} onClick={typeConnectHandler} width="100px" height="100px" title="variable" name="variable" src={imgVariable}/>
              </li>
            </ul>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name&&form.typeConnect&&form.typeConnect!=="system"}>
            <label>
              <h5>Enter the device address</h5>
              <input className = "textInput" placeholder="address" id="Address" type="text" name="address" value={form.address} onChange={changeHandler} required/>
            </label>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name&&form.typeConnect&&form.typeConnect!=="system"&&form.address}>
            <ul className="selectioEnlementUl">
            {
              (form.typeConnect==="yeelight"||form.typeConnect==="mqtt"||form.typeConnect==="miio")?
              <li>
                <SelectioEnlementImg active={(form.typeDevice==="light")} onClick={typeDeviceHandler} width="100px" height="100px" title = "light device" name="light" src={imgLight}/>
              </li>
              :null
            }
            {
              (form.typeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.typeDevice==="switch")} onClick={typeDeviceHandler} width="100px" height="100px" title="switch device" name="switch" src={imgSwitch}/>
              </li>
              :null
            }
            {
              (form.typeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.typeDevice==="dimmer")} onClick={typeDeviceHandler} width="100px" height="100px" title = "dimmer device" name="dimmer" src={imgDimmer}/>
              </li>
              :null
            }
            {
              (form.typeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.typeDevice==="sensor")} onClick={typeDeviceHandler} width="100px" height="100px" title="sensor device" name="sensor" src={imgSensor}/>
              </li>
              :null
            }
            {
              (form.typeConnect==="mqtt")?
              <li>
                <SelectioEnlementImg active={(form.typeDevice==="other")} onClick={typeDeviceHandler} width="100px" height="100px" title="other device" name="other" src={imgOther}/>
              </li>
              :null
            }
            </ul>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name&&form.typeConnect&&form.typeDevice&&form.typeConnect!=="system"&&form.typeConnect==="mqtt"}>
            <ul className="selectioEnlementUl">
              <li>
                <SelectioEnlementImg active={(form.typeValue==="json")} onClick={typeValueHandler} width="100px" height="100px" title = "json" name="json" src={imgJSON}/>
              </li>
              <li>
                <SelectioEnlementImg active={(form.typeValue==="value")} onClick={typeValueHandler} width="100px" height="100px" title = "value" name="value" src={imgValue}/>
              </li>
            </ul>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name&&form.typeDevice&&form.typeDevice!=="variable"&&form.typeConnect==="mqtt"&&form.typeValue}>
            {
              (form.typeConnect==="mqtt"&&form.typeDevice==="light")?
              <LightMqtt onChange={confHandler} type={form.typeValue}/>:
              (form.typeConnect==="mqtt"&&form.typeDevice==="switch")?
              <RelayMqtt onChange={confHandler} type={form.typeValue}/>:
              (form.typeConnect==="mqtt"&&form.typeDevice==="dimmer")?
              <DimmerMqtt onChange={confHandler} type={form.typeValue}/>:
              (form.typeConnect==="mqtt"&&form.typeDevice==="sensor")?
              <SensorMqtt onChange={confHandler} type={form.typeValue}/>:
              (form.typeConnect==="mqtt"&&form.typeDevice==="other")?
              <OtherMqtt onChange={confHandler} type={form.typeValue}/>:
              null
            }
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name&&form.typeDevice&&form.typeDevice!=="variable"&&form.typeConnect==="miio"&&form.typeValue}>
              <label>
                <h5>Enter the device token</h5>
                <input className = "textInput" placeholder="token" id="Token" type="text" name="token" value={form.token} onChange={tokenHandler} required/>
              </label>
          </AnimationLi>
          <AnimationLi className="conteiner-body-li" show={form.systemName&&form.name&&form.address&&form.typeDevice&&(form.typeConnect==="yeelight"||form.typeDevice==="variable"||(form.typeConnect==="miio"&&form.token)||(form.typeConnect&&form.config[0]&&form.config[0].address))}>
            <button className="btnOut" onClick={outHandler}>Save</button>
          </AnimationLi>
        </ul>
      </div>
    </div>
  )
}
