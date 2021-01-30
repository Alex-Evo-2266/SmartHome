import React, {useState,useEffect,useCallback, useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {LightMqttConf} from './formPages/LightMqttConf.js'
import {SwitchMqttConf} from './formPages/SwitchMqttConf.js'
import {SensorMqttConf} from './formPages/SensorMqttConf.js'
import {IRMqttConf} from './formPages/IRMqttConf.js'
import {DimmerMqttConf} from './formPages/DimmerMqttConf.js'
import {BinarySensorMqttConf} from './formPages/BinarySensorMqttConf.js'
import {HidingLi} from '../../hidingLi.js'
import {useChecked} from '../../../hooks/checked.hook'
import imgLight from '../../../img/lightDevices.jpg';
import imgDimmer from '../../../img/dimmerDevices.jpg';
import imgIr from '../../../img/IR.jpg';
import imgSensor from '../../../img/sensorDevices.jpg';
import imgSwitch from '../../../img/switchDevices.jpg';
import imgBinarySensor from '../../../img/binarySensorDevices.jpg';


export const AddDevicesForm = (props)=>{
  const [showPage, setShowPage] = useState(0);
  const {USText} = useChecked()
  const [result, setResult] = useState("");
  const [form, setForm] = useState({
    typeConnect: '',
    typeDevice: '',
    name: '',
    systemName:'',
    config:[],
  });

  const {message, clearMessage} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const auth = useContext(AuthContext)

  const next = ()=>{
    setShowPage(showPage + 1);
  }
  const back = ()=>{
    setShowPage(showPage - 1);
  }

  const updatePage = useCallback(() =>{
    const pages = document.body.getElementsByClassName('pageForm');
    for (var i = 0; i < pages.length; i++) {
      if(i<showPage){
        pages[i].className = "pageForm close"
      }
      else if(i===showPage){
        pages[i].className = "pageForm show"
      }
      else if(i>showPage){
        pages[i].className = "pageForm hide"
      }
    }
  },[showPage])

  useEffect(()=>{
    updatePage();
  },[showPage,updatePage])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

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

  const outHandler = async () => {
    try {
      clearMessage();
      console.log(form);
      const data = await request('/api/devices/add', 'POST', {...form},{Authorization: `Bearer ${auth.token}`})
      console.log(data);
      setResult(data.message);
      next();
    } catch (e) {

    }
  }
  const confSave = (conf)=>{
    setForm({...form, config:conf})
    next()
  }

  const obj = ()=>{
    let str = []
    let i  = 0;
    for(let key in form){
      if(key==="config"){
        for(let key2 in form[key]){
          if(form[key][key2]===0){
            str[i] = `${key2}: ${form[key][key2]}`;
          }
          else {
            str[i] = `${key2}: ${form[key][key2]||"\"\""}`;
          }
          i++;
        }
        continue;
      }
      str[i] = `${key}: ${form[key]}`;
      i++;
    }
    return str;
  }

  return (
    <>
    <div className = "form">
        <div className = "pageForm show">
          <div id = "formContent" className = "formContent">
            <h2>Create Device</h2>
            <p>
              Hello. this is the menu for creating a new device, click start to continue.
            </p>
          </div>
          <div className="formFooter">
            <button onClick={next} className ="FormControlBtn right">Start <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
        <div className = "choiceDeviceType pageForm hide">
          <div className = "formContent">
            <h2>Select device type</h2>
            <ul className="devicesList">
              <li id="typeLight" className={(form.typeDevice==="light")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <img alt={"type icon"} src={imgLight}/>
                  </div>
                  <p>Light</p>
                  <input type="button" name="typeDevice" value="light" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
              <li id="typeSwitch" className={(form.typeDevice==="switch")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <img alt={"type icon"} src={imgSwitch}/>
                  </div>
                  <p>Switch</p>
                  <input type="button" name="typeDevice" value="switch" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
              <li id="typeSensor" className={(form.typeDevice==="sensor")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <img alt={"type icon"} src={imgSensor}/>
                  </div>
                  <p>Sensor</p>
                  <input type="button" name="typeDevice" value="sensor" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
              <li id="typeBinarySensor" className={(form.typeDevice==="binarySensor")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <img alt={"type icon"} src={imgBinarySensor}/>
                  </div>
                  <p>BinarySensor</p>
                  <input type="button" name="typeDevice" value="binarySensor" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
              <li id="typeIR" className={(form.typeDevice==="ir")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <img alt={"type icon"} src={imgIr}/>
                  </div>
                  <p>IR port</p>
                  <input type="button" name="typeDevice" value="ir" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
              <li id="typeDimmer" className={(form.typeDevice==="dimmer")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <img alt={"type icon"} src={imgDimmer}/>
                  </div>
                  <p>Dimmer</p>
                  <input type="button" name="typeDevice" value="dimmer" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
              <li id="typeDimmer" className={(form.typeDevice==="variable")?"active":""}>
                <label>
                  <div className="imageConteiner">
                    <div className="iconImage"><p>#</p></div>
                  </div>
                  <p>System variable</p>
                  <input type="button" name="typeDevice" value="variable" onClick={changeHandler} />
                  <span className="indecator"/>
                </label>
              </li>
            </ul>
          </div>
            <div className="formFooter">
              <button onClick={next} className ='FormControlBtn right' disabled = {!form.typeDevice}>Next <i className="fas fa-arrow-right"></i></button>
              <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
            </div>
          </div>
          {
            (form.typeDevice!=="variable")?
            <div className = "pageForm hide">
              <div className = "formContent">
                <h2>Select communication protocol</h2>
                <div className = "choice flex">
                  <input type="button" content = "miio" style={{background:"red"}} name = "typeConnect" className ={`choiceElem circle ${(form&&form.typeConnect==="miio")?"active":""}`} value = "Miio" onClick = {()=>setForm({ ...form, typeConnect: "miio" })}/>
                  <input type="button" content = "mqtt" style={{background:"#4B0082",color:"#fff"}} name = "typeConnect" className ={`choiceElem circle ${(form&&form.typeConnect==="mqtt")?"active":""}`} value = "Mqtt" onClick = {()=>setForm({ ...form, typeConnect: "mqtt" })}/>
                  <input type="button" content = "other" style={{background:"red"}} name="typeConnect" className={`choiceElem circle ${(form&&form.typeConnect!=="miio"&&form.typeConnect!=="mqtt"&&form.typeConnect!=="")?"active":""}`} value = "Other" onClick = {()=>setForm({ ...form, typeConnect: "other" })}/>
                </div>
              </div>
              <div className="formFooter">
                <button onClick={next} className ="FormControlBtn right" disabled = {!form.typeConnect}>Next <i className="fas fa-arrow-right"></i></button>
                <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
              </div>
            </div>
            :null
          }
        <div className = "pageForm hide">
          <div className = "formContent moreInput">
            <ul>
              <HidingLi show={true} title="Name">
              <label>
                <h5>Enter the device name</h5>
                <input className = "textInput" placeholder="name" id="name" type="text" name="name" value={form.name} onChange={changeHandler} required/>
              </label>
              <label>
                <h5>Enter the device System name</h5>
                <input className = "textInput" placeholder="system name" id="SystemName" type="text" name="systemName" value={form.sysyemName} onChange={changeHandlerTest} required/>
              </label>
              </HidingLi>
            </ul>
          </div>
          <div className="formFooter">
            <button onClick={next} className ='FormControlBtn right' disabled = {!form.name||!form.systemName}>Next <i className="fas fa-arrow-right"></i></button>
            <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
          </div>
        </div>
        {
          (form.typeConnect === "mqtt")?
          (form.typeDevice === "light")?
          <LightMqttConf next={confSave} back={back}/>
          :
          (form.typeDevice === "switch")?
          <SwitchMqttConf next={confSave} back={back}/>
          :
          (form.typeDevice === "sensor")?
          <SensorMqttConf next={confSave} back={back}/>
          :
          (form.typeDevice === "binarySensor")?
          <BinarySensorMqttConf next={confSave} back={back}/>
          :
          (form.typeDevice === "ir")?
          <IRMqttConf next={confSave} back={back}/>
          :
          (form.typeDevice === "dimmer")?
          <DimmerMqttConf next={confSave} back={back}/>
          :
          <div className = "pageForm hide">
            <p>404</p>
          </div>
          :(form.typeDevice !== "variable")?
          <div className = "pageForm hide">
            <p>404</p>
          </div>:null

        }
        <div className = "pageForm hide">
          <div className = "formContent check">
            <h2>Check</h2>
            {
              obj().map((str, index)=><p className="pading0" key = {index}>{str}</p>)
            }

          </div>
          <div className="formFooter">
            <button onClick={outHandler} className ='FormControlBtn right'>Send <i className="fas fa-arrow-right"></i></button>
            <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
          </div>
        </div>
        <div className = "pageForm hide">
          <div className = "formContent">
            {
              (loading)?
              <h2>loading...</h2>:
              <h2>{result}</h2>
            }
          </div>
          <div className="formFooter">
            <button onClick={props.hide} className ='FormControlBtn right' disabled = {loading}>Finish</button>
          </div>
        </div>
    </div>
    <div className= "progressForm">
    </div>
    </>
  )
}
