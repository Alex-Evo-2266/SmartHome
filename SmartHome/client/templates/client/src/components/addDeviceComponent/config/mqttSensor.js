import React, {useState} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const SensorMqtt = ({onChange,back,type})=>{

  const [form, setForm] = useState([{
    address:"c0",
    type:"c0",
    icon:""
  }]);
  const [count, setCount] = useState(1);

  const addField = ()=>{
    let arr = form.slice()
    arr.push({
      address:"c"+count,
      type:"c"+count,
      icon:""
    })
    setCount((prev)=>prev+1)
    setForm(arr)
  }
  const deleteField = (index)=>{
    let arr = form.slice()
    arr = arr.filter((it,index2)=>index!==index2)
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
            return (
              <HidingLi title = "Field" show = {true} key={index}>
              <label>
                <h5>Enter the type</h5>
                <input data-id={index} className = "textInput" placeholder="type" id="type" type="text" name="type" value={item.type} onChange={changeHandler} required/>
              </label>
              <label>
                <h5>Enter the address</h5>
                <input data-id={index} className = "textInput" placeholder="address" id="address" type="text" name="address" value={item.address} onChange={changeHandler} required/>
              </label>
              <label>
                <h5>Enter the unit</h5>
                <input data-id={index} className = "textInput" placeholder="unit" id="unit" type="text" name="icon" value={item.icon} onChange={changeHandler} required/>
              </label>
              <button onClick={()=>deleteField(index)}>delete</button>
              </HidingLi>
            )
          })
        }
        </ul>
        <button onClick={addField}>add</button>
      </div>
  )
}
