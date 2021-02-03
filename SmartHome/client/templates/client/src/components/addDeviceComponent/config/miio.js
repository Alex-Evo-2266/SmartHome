import React,{useState, useEffect,useCallback} from 'react'

export const MiioConfig = ({onChange})=>{

  const [config,setConfig] = useState({
    address:"",
    token:"",
    type:"base"
  })

  const changeHandler = event => {
    setConfig({ ...config, [event.target.name]: event.target.value })
  }

  const out = useCallback(()=>{
    onChange([config])
  },[config,onChange])

  useEffect(()=>{
    out()
  },[config])

  return(
      <ul>
        <li className="conteiner-body-subli">
          <label>
            <h5>Enter the device ip</h5>
            <input className = "textInput" placeholder="id" id="id" type="text" name="address" onChange={changeHandler} required/>
          </label>
        </li>
        <li className="conteiner-body-subli">
          <label>
            <h5>Enter the device token</h5>
            <input className = "textInput" placeholder="token" id="token" type="text" name="token" onChange={changeHandler} required/>
          </label>
        </li>
      </ul>
  )
}
