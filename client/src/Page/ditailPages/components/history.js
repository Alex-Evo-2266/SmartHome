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

  useEffect(()=>{
    getHistory()
  },[getHistory])

  useEffect(()=>{
    setField(converHistorys(history, fieldname))
  },[fieldname, history])

  useEffect(()=>{
    console.log(field);
  },[field])

  return(
    <div className="historyContainer">
      <div className="canvasContainer">
      {
        (field?.type === "binary" || field?.type === "number")?
        <CanvasJSChart options={getOption(field, nawstyle)}/>
        :<HistoryList records={field} title={field?.deviceName}/>
      }
      </div>
      <div className="menuContainer">
        <div className="historySetingsContainer"></div>
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
