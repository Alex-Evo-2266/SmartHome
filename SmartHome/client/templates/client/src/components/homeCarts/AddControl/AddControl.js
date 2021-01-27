import React, {useContext,useState} from 'react'
import {AddControlContext} from './AddControlContext'
import {BackForm} from '../../moduls/backForm'
import {ModalWindow} from '../../modalWindow/modalWindow'
import {SwitchDevice} from './devicesControl/SwitchDevice'
import {LightFunction} from './devicesFunction/lightFunction'
import {SwitchFunction} from './devicesFunction/switchFunction'
import {DimmerFunction} from './devicesFunction/dimmerFunction'
import {IrFunction} from './devicesFunction/irFunction'

export const AddControl = ()=>{
  const {addControl, hide} = useContext(AddControlContext)
  const [typeChild, setTypeChild] = useState("");
  const [lightFunctionVisible,setLightFunctionVisible] = useState(false);
  const [switchFunctionVisible,setSwitchFunctionVisible] = useState(false);
  const [dimmerFunctionVisible,setDimmerFunctionVisible] = useState(false);
  const [irFunctionVisible,setIrFunctionVisible] = useState(false);
  const [device, setDevice] = useState({});

  const close = ()=>{
    hide()
    setTypeChild("")
    setLightFunctionVisible(false)
    setSwitchFunctionVisible(false)
    setDimmerFunctionVisible(false)
    setIrFunctionVisible(false)
  }

  const deviceFunction = (device)=>{
    if(typeChild==="script"){
      addButton({
        item:typeChild,
        type:"activate script",
        order:"0",
        name:device.ScriptName,
        IdScript:device.ScriptId
      })
    }
    if(device.DeviceType==="light")
      setLightFunctionVisible(true)
    if(device.DeviceType==="switch")
      setSwitchFunctionVisible(true)
    if(device.DeviceType==="dimmer")
      setDimmerFunctionVisible(true)
    if(device.DeviceType==="ir")
      setIrFunctionVisible(true)
    if(device.DeviceType==="sensor"||device.DeviceType==="binarySensor")
      addButton({
        item:typeChild,
        type:"value",
        order:"0",
        name:device.DeviceName,
        IdDevice:device.DeviceId
      })
    setDevice(device)
  }

  const addButton = (t)=>{
    if(addControl.OK){
      addControl.OK(t)
    }
    close()
  }

  if(!addControl.visible){
    return null;
  }

  if(addControl.type === "AddButton"){
    return (
      <BackForm onClick = {close}>
      <ModalWindow
        hide={close}
        title="Add button"
        moving={false}
        backForm={true}
        style={{width:"400px",left:"50%",transform: "translateX(-50%)", top:"100px",maxHeight:"calc(100% - 200px)"}}
        styleContent={{minHeight:"300px"}}
      >
      <div className="editcart-conteiner childrenList active">
        <p>сontainer children</p>
        <div className="buttonGrid">
          <button onClick={()=>setTypeChild("button")}>button activate</button>
          <button onClick={()=>setTypeChild("script")}>activate scripts</button>
          <button onClick={()=>setTypeChild("slider")}>slider</button>
          <button onClick={()=>setTypeChild("sensor")}>sensor</button>
        </div>
      </div>
      {
        (typeChild!=="")?
        <>
        <div className={`editcart-conteiner childrenList ${(typeChild!=="")?"active":""}`}>
          <SwitchDevice type={typeChild} result={deviceFunction}/>
        </div>
        <div className={`editcart-conteiner childrenList ${(lightFunctionVisible)?"active":""}`}>
          <LightFunction type={typeChild} device={device} result={addButton}/>
        </div>
        <div className={`editcart-conteiner childrenList ${(switchFunctionVisible)?"active":""}`}>
          <SwitchFunction type={typeChild} device={device} result={addButton}/>
        </div>
        <div className={`editcart-conteiner childrenList ${(dimmerFunctionVisible)?"active":""}`}>
          <DimmerFunction type={typeChild} device={device} result={addButton}/>
        </div>
        <div className={`editcart-conteiner childrenList ${(irFunctionVisible)?"active":""}`}>
          <IrFunction type={typeChild} device={device} result={addButton}/>
        </div>
        </>
        :null
      }
      </ModalWindow>
      </BackForm>
    )
  }
}
