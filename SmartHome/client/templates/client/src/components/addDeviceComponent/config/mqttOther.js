import React, {useState} from 'react'

export const OtherMqtt = ({onChange,back,type})=>{

  const [form, setForm] = useState([{
    address:"c0",
    type:"c0"
  }]);
  const [count, setCount] = useState(1);

  const addField = ()=>{
    let arr = form.slice()
    arr.push({
      address:"c"+count,
      type:"c"+count
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
                    <h5>Enter the address by command</h5>
                    <input data-id={index} className = "textInput" placeholder="topic command" id="command" type="text" name="address" value={item.address} onChange={changeHandler} required/>
                  </label>
                  <button onClick={()=>deleteField(index)}>delete</button>
                </li>
              )
            })
          }

        </ul>
        <button onClick={addField}>add</button>
      </div>
  )
}
