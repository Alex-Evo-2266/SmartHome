import React,{useEffect,useState,useCallback,useContext} from 'react'
import {Header} from '../components/header'
import {Loader} from '../components/Loader'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {MQTTElement} from '../components/mqttCards/mqttCard'
import {SocketContext} from '../context/SocketContext'
import {MenuContext} from '../components/Menu/menuContext'
import {BackForm} from '../components/backForm'

export const MqttPage = ()=>{
  const auth = useContext(AuthContext)
  const [deviceMqtt,setDeviceMqtt] = useState([])
  const [allDeviceMqtt, setAllDeviceMqtt] = useState([])
  const [searchTopik, setSearchTopik] = useState("")
  const [searchDevice, setSearchDevice] = useState("")
  const [ditail, setDitail] = useState(null)
  const {loading, request, error, clearError} = useHttp();
  const socket = useContext(SocketContext)
  const {message} = useMessage();
  const {setData} = useContext(MenuContext)

  const getDev = useCallback(async () => {
    try {
      let data = await request('/api/mqtt', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        setDeviceMqtt(data)
        setAllDeviceMqtt(data)
      }
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  function Decice(data) {
    let devices = []
    if(data.lincs){
      for (var item of data.lincs) {
        let dev = item.device
        let field
        if(dev.DeviceValueType!=="json" && item.field){
          field = item.field.name
        }
        devices.push(`${dev.DeviceSystemName}${(field)?`.${field}`:''}`)
      }
      return devices
    }
    return []
  }

  useEffect(()=>{
    let array = allDeviceMqtt
    if(searchTopik!==""){
      array = array.filter(item => item.topic.indexOf(searchTopik)!==-1)
    }
    if(searchDevice!==""){
      array = array.filter(item => {
        let lincs = Decice(item)
        for (var item2 of lincs) {
          if(item2.indexOf(searchDevice)!==-1)
            return true
        }
        return false
      })
    }
    setDeviceMqtt(array)
  },[searchTopik,allDeviceMqtt,searchDevice])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getDev()
  },[getDev])

  useEffect(()=>{
    if(socket.message.type==="mqtt") {
      setAllDeviceMqtt(socket.message.data)
    }
  },[socket.message])

  useEffect(()=>{
    setData("MQTT",{
      dopmenu: [
        {
          title:"clear",
          active:clearMqtt
        },
        {
          title:"update",
          active:getDev
        }
      ]
    })
  },[setData])

  function clearMqtt() {
    request('/api/mqtt/clear', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  }

  function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

  return (
    <div className="conteiner bottom">
    {
      (ditail)?
      <BackForm onClick={()=>setDitail(null)}>
        <div className="infoCard">
          <div className="field">{ditail.topic}</div>
          <div className="field">
            <pre>
              {
                (ditail?.event?.typeMessage==="json")?
                JSON.stringify(JSON.parse(ditail.item.message), undefined, 4):
                ditail.item.message
              }
            </pre>
          </div>
          <div className="field">{Decice(ditail)}</div>
        </div>
      </BackForm>:
      null
    }
      {
        (loading||!deviceMqtt)?
        <Loader/>:
        <div>
          <div className="mqttTableDiv">
            <table className="mqttTable">
              <thead>
                <tr>
                  <th>
                    <div className="input-data">
                      <input onChange={(e)=>setSearchTopik(e.target.value)} value={searchTopik} required name="adress" type="text"></input>
                      <label>Adress</label>
                    </div>
                  </th>
                  <th>Message</th>
                  <th>
                    <div className="input-data">
                      <input onChange={(e)=>setSearchDevice(e.target.value)} value={searchDevice} required name="device" type="text"></input>
                      <label>Linc device</label>
                    </div>
                  </th>
                  <th>Control</th>
                </tr>
              </thead>
              <tbody>
              {
                deviceMqtt.map((item,index)=>{
                  return (
                    <tr key={index}>
                      <MQTTElement data = {item} onClickMessage={(event)=>setDitail({event,item})}/>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  )
}
