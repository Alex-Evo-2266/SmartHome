import React,{useContext,useState,useCallback} from 'react'
import {IfBlock} from './ifBlock'
import {AddScriptContext} from '../../addScript/addScriptContext'
import {ifClass,groupIfClass} from '../../../myClass.js'

export const GroupBlock = ({index,type,children,elements,requpdata,deleteEl})=>{
const {show} = useContext(AddScriptContext)
const [data, setData] = useState(elements)

const addEl = ()=>{
  show("typeBlock",(type,device)=>{
    if(typeof(data.addif)!=="function")
      return
    let el = data;
    let newEl;
    if(type==="groupBlockAnd")
      newEl = new groupIfClass("and")
    if(type==="groupBlockOr")
      newEl = new groupIfClass("or")
    if(type==="deviceBlock"&&device){
      if(device.DeviceId)
        newEl = new ifClass("device",device.DeviceId,"power","==","1")
    }
    el.addif(newEl)
    setData(el)
    requpdata(el,index)
    // let obj = script
    // obj.if.addif(newEl)
    // setScript(obj)
  })
}

const devEl = (index1)=>{
  if(typeof(data.updataif)!=="function")
    return
  let el = data;
  el.delif(index1)
  setData(el)
  if(typeof(requpdata)!=="function")
    return
  requpdata(el,index,true)
}


const reqUpdata = useCallback((data1,index1,reboot)=>{
  if(typeof(data.updataif)!=="function")
    return
  let el = data;
  el.updataif(data1,index1)
  setData(el)
  if(typeof(requpdata)!=="function")
    return
  requpdata(el,index,reboot)
},[data,requpdata,index])

  return(
    <div className="groupBlock">
      <div className="groupBlockTop">
        <p className="textBlock">{`start of block ${type}`}</p>
        <div className="addBlock" onClick={addEl}>
          <i className="fas fa-plus"></i>
        </div>
        {
          (typeof(deleteEl)==="function")?
          <div className="deleteBlock" onClick={()=>{deleteEl(index)}}>
            <i className="fas fa-trash"></i>
          </div>:
          null
        }
      </div>
      <div className="groupBlockConteiner">
      {
        (data)?
          data.ifElement.map((item,index1)=>{
            if(typeof(item.subif.addif)==="function"){
              return <GroupBlock index={index1} deleteEl={devEl} requpdata={reqUpdata} key={index1} type={item.subif.oper} elements={item.subif}/>
            }
            return <IfBlock key={index1} deleteEl={devEl} el={item.subif} index={index1} updata={reqUpdata} deviceId={item.subif.deviceId}/>
          })
        :null
      }
      </div>
      <div className="groupBlockBottom">
        <p className="textBlock">end block</p>
      </div>
    </div>
  )
}
