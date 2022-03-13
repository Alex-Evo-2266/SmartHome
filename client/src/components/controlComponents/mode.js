import React, {useState,useEffect} from 'react'

const foo = (systemName, type, v)=>{}

export const Mode = ({updata,title,type,conf,value,systemName,outValue=foo}) =>{
  const [newvalue, setValue]=useState(0)

  useEffect(()=>{
    setValue(value)
  },[value])

  const clickHandler = event =>{
    if(newvalue>=conf-1){
      setValue(0)
      outValue(systemName, type, 0)
    }
    else{
      outValue(systemName, type, newvalue+1)
      setValue(newvalue+1)
    }
    setTimeout(function () {
      if(typeof(updata)==='function')
        updata()
    }, 500);
  }
  if(conf===2){
    return(
      <li className="DeviceControlLi">
        <div className="DeviceControlLiName">
          <p>{title||type}</p>
        </div>
        <div className="DeviceControlLiContent">
          <div className="DeviceLiControl">
            <div className="custom1-checkbox">
              <div className={`custom1-inner ${(newvalue===1)?"active":""}`} onClick={clickHandler} >
                <div className="custom1-toggle"></div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"mode"}</p>
      </div>
      <div className="DeviceControlLiContent">
      <div className="DeviceControlLiValue">
        <p>{newvalue}</p>
      </div>
      <div className="DeviceLiControl">
        <input type="button" value="mode" onClick={clickHandler}/>
      </div>
      </div>
    </li>
  )
}
