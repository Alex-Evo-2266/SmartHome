import React,{useContext,useState,useEffect,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {Loader} from '../../Loader'

export const ServerOption = () =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [serverconf , setServerconf] = useState([]);

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  // const checkedHandler = event => {
  //   setServerconf({ ...serverconf, [event.target.name]: event.target.checked })
  // }
  const changeHandler = (event, module, field) => {
    let arr = serverconf.slice()
    for (var item of arr) {
      if(item.name === module)
      {
        for (var item2 of item.fields) {
          if(item2.name === field)
          {
            item2.value = event.target.value
            setServerconf(arr)
            return
          }
        }
        return
      }
    }
  }

  const serverConfigHandler = async(event)=>{
    request(`/api/server/config/edit`, 'POST', {moduleConfig:serverconf},{Authorization: `Bearer ${auth.token}`})
  }

  const updataConf = useCallback(async()=>{
    const data = await request(`/api/server/config/get`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data)return;
    let arr = []
    for (var item of data.moduleConfig) {
      arr.push(item)
    }
    setServerconf(arr)
  },[request,auth.token])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  if(loading){
    return <Loader/>
  }

  return(
    <div className = "pagecontent">
    {
      serverconf.map((item, index)=>{
        return(
          <div key={index}>
          <div className="configTitle">
            <p className="text">{item.name}</p>
          </div>
          {
            item?.fields?.map((item2, index2)=>{
              return(
                <div key={index2} className="configElement">
                  <div className="input-data">
                    <input onChange={(e)=>changeHandler(e, item.name, item2.name)} required name={item2.name} type="text" value={item2.value} disabled = {(!item2)}></input>
                    <label>{item2.name}</label>
                  </div>
                </div>
              )
            })
          }
          <div className="dividers"></div>
          </div>
        )
      })
    }
      <div className="configElement block">
        <button style={{width: "100%"}} className="normalSelection button" onClick={serverConfigHandler}>Save</button>
      </div>
    </div>
)
}
