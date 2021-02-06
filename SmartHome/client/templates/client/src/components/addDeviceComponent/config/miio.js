import React,{useState} from 'react'

export const MiioConfig = ({onChange})=>{

  const [config,setConfig] = useState({
    address:"",
    token:"",
    type:"base"
  })

  const changeHandler = event => {
    let s = { ...config, [event.target.name]: event.target.value }
    setConfig(s)
    onChange([s])
  }

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
