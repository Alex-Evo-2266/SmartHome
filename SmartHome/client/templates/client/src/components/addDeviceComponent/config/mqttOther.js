import React, {useState} from 'react'

export const OtherMqtt = ({onChange,back,type})=>{

  const [form, setForm] = useState([{
    address:"c0",
    type:"c0",
    typeControl:"text",
    low:"0",
    high:"100"
  }]);
  const [count, setCount] = useState(1);

  const addField = ()=>{
    let arr = form.slice()
    arr.push({
      address:"c"+count,
      type:"c"+count,
      typeControl:"text",
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
                <li key={index} data-id={index}>
                  <label>
                    <h5>Enter the type</h5>
                    <input data-id={index} className = "textInput" placeholder="type" id="type" type="text" name="type" value={item.type} onChange={changeHandler} required/>
                  </label>
                  <label>
                    <h5>Enter the address</h5>
                    <input data-id={index} className = "textInput" placeholder="address" id="address" type="text" name="address" value={item.address} onChange={changeHandler} required/>
                  </label>
                  <label>
                    <h5>Type</h5>
                    <select className = "textInput" data-id={index} name="typeControl" value={item.typeControl} onChange={changeHandler}>
                      <option value="boolean">boolean</option>
                      <option value="text">text</option>
                      <option value="number">number</option>
                      <option value="range">range</option>
                      <option value="sensor">sensor</option>
                      <option value="booleanSensor">booleanSensor</option>
                    </select>
                  </label>
                  {
                    (item.typeControl==="range"||item.typeControl==="boolean"||item.typeControl==="booleanSensor")?
                    <>
                    <label>
                      <h5>Enter the min</h5>
                      <input data-id={index} className = "textInput" placeholder="min Dimmer" id="minDimmer" type={(item.typeControl==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandler} required/>
                    </label>
                    <label>
                      <h5>Enter the max</h5>
                      <input data-id={index} className = "textInput" placeholder="max Dimmer" id="maxDimmer" type={(item.typeControl==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandler} required/>
                    </label>
                    </>
                    :null
                  }
                  <div className="hr">
                    <button className="delField" onClick={()=>deleteField(index)}>delete</button>
                  </div>
                </li>
              )
            })
          }
        </ul>
        <button className="addField" onClick={addField}>add</button>
      </div>
  )
}
