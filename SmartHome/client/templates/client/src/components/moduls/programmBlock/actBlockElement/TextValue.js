import React,{useState,useEffect} from 'react'

export const TextValue = ({disabled=false,number=false,deleteEl,updata})=>{
  const [value,setValue]=useState("0")

  const changeHandler = (event)=>{
    setValue(String(event.target.value))
    updata(String(event.target.value))
  }

  const deleteElement= ()=>{
    if(typeof(deleteEl)==="function")
      deleteEl()
  }

  useEffect(()=>{
    try {
      if(number){
        let test = Number(value)
        setValue(String(test))
      }
    } catch (e) {
      console.log("0");
      setValue("0")
    }
  },[number,value])

  return(
    <div className="valueBlock">
      <div className="typeBlock">
        {"Set in: "}
      </div>
      <div className="inputValueBlock">
      {
        (number)?
        <input type="number" value={Number(value)} name="value" onChange={changeHandler} disabled={disabled}/>:
        <input type="text" value={value} name="value" onChange={changeHandler} disabled={disabled}/>
      }
      </div>
      {
        (!disabled)?
        <div className="deleteBlock" onClick={()=>{deleteElement()}}>
          <i className="fas fa-trash"></i>
        </div>
        :null
      }
    </div>
  )
}
