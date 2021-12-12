import React,{useState,useEffect} from 'react'

export const InputNumber = ({min,max,step=1,Xten=false,result,Value})=>{
  const [value, setValue] = useState(min)

  useEffect(()=>{
    if(Value)
      setValue(Value)
  },[Value])
  const focusdel=(e)=>{
    e.target.parentNode.focus()
  }

  const up = (steploc=1)=>{
    let n = Number(value)
    if(n>=max)
      return
    if(n+steploc>max)
      return setValue(max)
    setValue(String(n+steploc))
    if(typeof(result)==="function")
      result(String(n+steploc))
  }
  const down = (steploc=1)=>{
    let n = Number(value)
    if(n<=min)
      return
    if(n-steploc<min)
      return setValue(min)
    setValue(String(n-steploc))
    if(typeof(result)==="function")
      result(String(n-steploc))
  }

  return(
    <div className = "InputNumber">
      <input type="text" readOnly value={value} min={min} max={max} onClick={focusdel} onKeyDown={(event)=>event.preventDefault()}/>
      <div className="InputNumber-btnConteiner">
        <div className="InputNumber-btnDown" onClick={()=>down(step)}><i className="fas fa-angle-left"></i></div>
        <div className="InputNumber-btnUp" onClick={()=>up(step)}><i className="fas fa-angle-right"></i></div>
      </div>
      {
        (Xten)?
        <div className="InputNumber-btnConteiner">
          <div className="InputNumber-btnDown" onClick={()=>down(10)}><i className="fas fa-angle-double-left"></i></div>
          <div className="InputNumber-btnUp" onClick={()=>up(10)}><i className="fas fa-angle-double-right"></i></div>
        </div>
        :null
      }
    </div>
  )
}
