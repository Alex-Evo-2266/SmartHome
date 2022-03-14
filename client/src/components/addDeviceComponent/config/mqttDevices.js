import React, {useState,useEffect} from 'react'
import {getConf} from './defaultTypeDevConfig'
import {HidingLi} from '../../hidingLi.js'


export const DeviceMqtt = ({onChange,back,type})=>{
  const [configForm, setConfigForm] = useState(getConf(type));
  const [form, setForm] = useState(configForm.fields);
  const [count, setCount] = useState(1);

  useEffect(()=>{
    setConfigForm(getConf(type))
    setForm(getConf(type).fields)
    onChange(getConf(type).fields)
  },[type,onChange])

  const addField = ()=>{
    let arr = form.slice()
    arr.push({
      address:"field"+count,
      name:"field"+count,
      type:(configForm.type==="sensor")?"sensor":"text",
      low:"0",
      high:"100",
      values:"",
      control:true,
      icon:"",
      unit:""
    })
    setCount((prev)=>prev+1)
    setForm(arr)
  }

  const deleteField = (index)=>{
    let arr = form.slice()
    arr = arr.filter((it,index2)=>index!==index2)
    arr = arr.map((item,i)=>{
      return {...item,type:"c"+i}
    })
    setCount((prev)=>prev-1)
    setForm(arr)
  }

  const nextpage = (param)=>{
    let arr = []
    for (var item of param) {
      if(item.address)
        arr.push(item)
    }
    onChange(arr)
  }

  const changeHandler = event => {
    let index = event.target.dataset.id
    let arr = form.slice()
    let newData = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newData
    setForm(arr)
    nextpage(arr)
  }

  const changeHandlerFieldChek = event => {
    let index = event.target.dataset.id
    let arr = form.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.checked }
    arr[index] = newcom
    setForm(arr)
    nextpage(arr)
  }

  return(
      <div className = "config">
        <ul>
          {
            form.map((item,index)=>{
              return(
                <HidingLi key={index} title = {item.name}>
                {
                  (configForm.editType)?
                  <label>
                    <h5>Enter the type</h5>
                    <input data-id={index} className = "textInput" placeholder="type" type="text" name="name" value={item.name} onChange={changeHandler} required/>
                  </label>
                  :null
                }
                  <label>
                    <h5>Enter the address</h5>
                    <input data-id={index} className = "textInput" placeholder="address" type="text" name="address" value={item.address} onChange={changeHandler} required/>
                  </label>
                  {
                    (configForm.editTypeControl)?
                    <label>
                      <h5>Type</h5>
                      <select className = "textInput" data-id={index} name="type" value={item.type} onChange={changeHandler}>
                        <option value="binary">binary</option>
                        <option value="text">text</option>
                        <option value="number">number</option>
                        <option value="enum">enum</option>
                      </select>
                    </label>
                    :null
                  }
                  {
                    (configForm.editType)?
                    <label>
                      <h5>Enter the control</h5>
                      <input data-id={index} type="checkbox" className = "textInput" placeholder="unit" name="control" checked={Boolean(item.control)} onChange={changeHandlerFieldChek} required/>
                    </label>
                    :null
                  }
                  {
                    (item.type==="number"||item.type==="binary")?
                    <>
                    <label>
                      <h5>Enter the min</h5>
                      <input data-id={index} className = "textInput" placeholder="min" type={(item.typeControl==="number")?"number":"text"} name="low" value={item.low} onChange={changeHandler} required/>
                    </label>
                    <label>
                      <h5>Enter the max</h5>
                      <input data-id={index} className = "textInput" placeholder="max" type={(item.typeControl==="number")?"number":"text"} name="high" value={item.high} onChange={changeHandler} required/>
                    </label>
                    </>:
                    (item.type==="enum")?
                    <label>
                      <h5>Enter the enum</h5>
                      <input data-id={index} className = "textInput" placeholder="enum" type="text" name="values" value={item.values} onChange={changeHandler} required/>
                    </label>
                    :null
                  }
                  <label>
                    <h5>Enter the icon</h5>
                    <input data-id={index} className = "textInput" placeholder="icon" name="icon" value={item.icon} onChange={changeHandler} required/>
                  </label>
                  {
                    (item.type==="number")?
                    <label>
                      <h5>Enter the unit</h5>
                      <input data-id={index} className = "textInput" placeholder="unit" name="unit" value={item.unit} onChange={changeHandler} required/>
                    </label>:null
                  }
                  {
                    (configForm.editCountField)?
                    <div className="hr">
                      <button className="delField" onClick={()=>deleteField(index)}>delete</button>
                    </div>
                    :null
                  }
                </HidingLi>
              )
            })
          }
        </ul>
        {
          (configForm.editCountField)?
          <button className="addField" onClick={addField}>add</button>
          :null
        }
      </div>
  )
}
