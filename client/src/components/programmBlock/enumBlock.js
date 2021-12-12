import React,{useState} from 'react'

export const EnumBlock = ({data,updata,block,deleteEl,values=[]})=>{
  const [value,setValue] = useState(data.value)

  const changeHandler = event=>{
    setValue(event.target.value)
    updata({action:event.target.value})
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        value
      </div>
      <div className="programm-function-block-content-item">
        <select onChange={changeHandler} value={value}>
        {
          values.map((item,index)=>{
            return(
              <option key={index} value={item}>{item}</option>
            )
          })
        }
        </select>
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl()}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
