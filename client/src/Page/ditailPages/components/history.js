import React, {useContext,useEffect,useState,useCallback} from 'react'
import {CanvasJSChart} from 'canvasjs-react-charts'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {StyleContext} from '../../../components/UserStyle/StyleContext'
import {HistoryList} from './historyList'
import {converHistorys, getOption} from './utils'

export const History = ({device}) => {
  const auth = useContext(AuthContext)
  const {nawstyle} = useContext(StyleContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [history, setHistory] = useState([])
  const [range, setrange] = useState("all")
  const [fieldname, setFieldname] = useState(device.config[0].name)
  const [field, setField] = useState(null)

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const getHistory = useCallback(async ()=>{
    let data = await request(`/api/device/history/get/${device.systemName}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    if(data)
      setHistory(data)
  },[auth.token, request, device.systemName])

  const filterTime = (data, time)=>{
    let naw = new Date()
    let newdata = {...data}
    if(time==="year")
      newdata.data = data.data.filter((item)=>item.x.getFullYear() === naw.getFullYear())
    else if(time==="month")
      newdata.data = data.data.filter((item)=>(item.x.getMonth() === naw.getMonth() && item.x.getFullYear() === naw.getFullYear()))
    else if(time==="day")
      newdata.data = data.data.filter((item)=>(item.x.getDate() === naw.getDate() && item.x.getMonth() === naw.getMonth() && item.x.getFullYear() === naw.getFullYear()))
    return newdata
  }

  useEffect(()=>{
    getHistory()
  },[getHistory])

  useEffect(()=>{
    setField(converHistorys(history, fieldname))
  },[fieldname, history])

  return(
    <div className="historyContainer">
      <div className="canvasContainer">
      {
        (field?.type === "binary" || field?.type === "number")?
        <CanvasJSChart options={getOption(filterTime(field, range), nawstyle)}/>
        :<HistoryList records={filterTime(field, range)} title={field?.deviceName}/>
      }
      </div>
      <div className="menuContainer">
        <div className="historySetingsContainer">
          <div className="SetingsBtn">
            <div className={(range==="all")?"active":""} onClick={()=>setrange("all")}>all</div>
            <div className={(range==="year")?"active":""} onClick={()=>setrange("year")}>year</div>
            <div className={(range==="month")?"active":""} onClick={()=>setrange("month")}>month</div>
            <div className={(range==="day")?"active":""} onClick={()=>setrange("day")}>day</div>
          </div>
        </div>
        <div className="fieldsList">
          <ul>
            {
              device?.config?.map((item, index)=>{
                return(
                  <li key={index} className={(fieldname === item.name)?"active":""} onClick={()=>setFieldname(item.name)}>
                    {item.name}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
