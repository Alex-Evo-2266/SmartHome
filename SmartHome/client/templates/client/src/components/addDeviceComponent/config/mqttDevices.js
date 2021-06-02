import React, {useState,useEffect} from 'react'
import {getConf} from './defaultTypeDevConfig'
import {HidingLi} from '../../hidingLi.js'


export const DeviceMqtt = ({onChange,back,type})=>{
  const [configForm, setConfigForm] = useState(getConf(type));
  const [form, setForm] = useState(configForm.config);
  const [count, setCount] = useState(1);

  useEffect(()=>{
    setConfigForm(getConf(type))
    setForm(getConf(type).config)
    onChange(getConf(type).config)
  },[type,onChange])

  const addField = ()=>{
    let arr = form.slice()
    arr.push({
      address:"field"+count,
      type:"field"+count,
      typeControl:(configForm.typeControl==="sensor")?"sensor":"text",
      low:"0",
      high:"100"
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
    console.log(index);
    let arr = form.slice()
    let newData = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newData
    setForm(arr)
    nextpage(arr)
  }

  return(
      <div className = "config">
        <ul>
          {
            form.map((item,index)=>{
              return(
                <HidingLi key={index} title = {item.type}>
                {
                  (configForm.editType)?
                  <label>
                    <h5>Enter the type</h5>
                    <input data-id={index} className = "textInput" placeholder="type" type="text" name="type" value={item.type} onChange={changeHandler} required/>
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
                      <select className = "textInput" data-id={index} name="typeControl" value={item.typeControl} onChange={changeHandler}>
                        {
                          (configForm.typeControl==="control"||configForm.typeControl==="all")?
                          <>
                          <option value="boolean">boolean</option>
                          <option value="text">text</option>
                          <option value="number">number</option>
                          <option value="range">range</option>
                          </>:null
                        }
                        {
                          (configForm.typeControl==="sensor"||configForm.typeControl==="all")?
                          <>
                          <option value="sensor">sensor</option>
                          <option value="booleanSensor">booleanSensor</option>
                          </>:null
                        }
                      </select>
                    </label>
                    :null
                  }
                  {
                    (item.typeControl==="range"||item.typeControl==="boolean"||item.typeControl==="booleanSensor")?
                    <>
                    <label>
                      <h5>Enter the min</h5>
                      <input data-id={index} className = "textInput" placeholder="min" type={(item.typeControl==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandler} required/>
                    </label>
                    <label>
                      <h5>Enter the max</h5>
                      <input data-id={index} className = "textInput" placeholder="max" type={(item.typeControl==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandler} required/>
                    </label>
                    </>:
                    (item.typeControl==="number")?
                    <label>
                      <h5>Enter the Count</h5>
                      <input data-id={index} className = "textInput" placeholder="max" type={(item.typeControl==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandler} required/>
                    </label>
                    :null
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
