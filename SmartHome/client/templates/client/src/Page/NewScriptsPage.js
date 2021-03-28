import React,{useState,useContext,useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {useChecked} from '../hooks/checked.hook'
import {AuthContext} from '../context/AuthContext.js'
import {AddScriptBase} from '../components/addScript/addScriptBase'
import {GroupBlock} from '../components/moduls/programmBlock/groupBlock'
import {ActBlock} from '../components/moduls/programmBlock/actBlock'
import {TriggerBlock} from '../components/moduls/programmBlock/triggerBlock'
// import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {AddScriptContext} from '../components/addScript/addScriptContext'
import {useHistory} from 'react-router-dom'
// import {groupIfClass,actClass,triggerClass} from '../myClass.js'

export const NewScriptsPage = () => {
  const history = useHistory()
  const {USText} = useChecked()
  const auth = useContext(AuthContext)
  const {show} = useContext(AddScriptContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const[cost, setCost]=useState(true)
  const[script, setScript]=useState({
    name:"",
    trigger:[],
    if:{type:"group" ,oper:"and",children:[],idDevice:null,action:null,value:null},
    then:[],
    else:[]
  })

  const addTrigger = ()=>{
    show("triggerBlock",(none,dataDev)=>{
      if(!dataDev||!dataDev.DeviceId)
        return
      let mas = script;
      mas.trigger.push({type:"device",action:"all",DeviseId:dataDev.DeviceId})
      setScript(mas)
    })
  }

  const deleteTrigger = (index)=>{
    if(!script||!script.trigger)
      return
    let mas = script;
    mas.trigger = mas.trigger.filter((_,i)=>i!==index)
    setScript(mas)
    setCost((prev)=>!prev)
  }

  const addActBlock = (type)=>{
    show("deviceBlock",(none,dataDev)=>{
      if(!dataDev||!dataDev.DeviceId)
        return
      let mas = script;
      let act = "power"
      if(dataDev.DeviceType==="dimmer"){
        act = "dimmer"
      }
      if(dataDev.DeviceType==="variable"){
        act = "value"
      }
      mas[type].push({type:"device",action:act,DeviseId:dataDev.DeviceId})
      setScript(mas)
    })
  }

  const deleteActBlock = (type,index)=>{
    if(!script||!script[type])
      return
    let mas = script;
    mas[type] = mas[type].filter((_,i)=>i!==index)
    setScript(mas)
    setCost((prev)=>!prev)
  }

  const changeHandler = (event)=>{
    setScript({...script,[event.target.name]:event.target.value})
  }

  const outHandler = async()=>{
    console.log(script);
    try {
      if(!USText(script.name)){
        console.error("allowed characters: 1234567890_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM");
        let el = document.getElementById("scriptName")
        el.style="background:red;"
        message("allowed characters: 1234567890_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM","error")
        return
      }
      const data = await request('/api/script/add', 'POST', {...script},{Authorization: `Bearer ${auth.token}`})
      if(data){
        history.push('/scripts')
      }
    } catch (e) {
      console.error(e);
    }
  }

  const updatascript=(type,data)=>{
    console.log(type,data);
    let mas = script;
    let components = mas[type]
    let component = components[data.index]
    for (var key in data) {
      if (key!=="index") {
        component[key] = data[key]
      }
    }
    components[data.index] = component
    mas[type] = components
    console.log(mas);
    setScript(mas)
    setCost((prev)=>!prev)
  }

  const updataIfBlock=(data)=>{
    console.log(data);
    let mas = script;
    mas.if = data
    console.log(mas);
    setScript(mas)
    setCost((prev)=>!prev)
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    console.log(script);
  },[script])

  useEffect(()=>{
    if(!cost)
    setCost(true)
  },[cost])

  return(
    <>
      <AddScriptBase/>
      <div className = "NewScripConteiner">
      <h2>Create new script</h2>
        <div className="NewScripPage">
          <div className="scriptOut">
            <p>Script name</p>
            <input type="text" id="scriptName" name="name" value={script.name} onChange={changeHandler}/>
            <button onClick={outHandler}>Send</button>
          </div>
          <div className="progammzon">
            <div className="triggerBlock">
              <div className="baseBlock">
                <div className="textBlock">
                  <p>Trigger</p>
                </div>
                <div className="addBlock" onClick={addTrigger}>
                  <i className="fas fa-plus"></i>
                </div>
              </div>
              {
                (cost)?
                script.trigger.map((item,index)=>{
                  return <TriggerBlock key={index} index={index} updata={(data1)=>updatascript("trigger",data1)} deleteEl={()=>deleteTrigger(index)} block="trigger" deviceId={item.DeviseId}/>
                }):null
              }
            </div>
            <div className="baseBlock">
              <div className="textBlock">
                <p>if</p>
              </div>
            </div>
            {
              (script.if.children&&cost)?
                <GroupBlock index = {"1"} type={script.if.oper} data={script.if} updata={updataIfBlock}/>
              :null
            }
            <div className="baseBlock">
              <div className="textBlock">
                <p>then</p>
              </div>
              <div className="addBlock" onClick={()=>addActBlock("then")}>
                <i className="fas fa-plus"></i>
              </div>
            </div>
            <div className="groupBlockConteiner">
            {
              (cost)?
              script.then.map((item,index)=>{
                return <ActBlock deleteEl={()=>deleteActBlock("then",index)} updata={(data1)=>updatascript("then",data1)} key={index} data={item} index={index} block="then" idDevice={item.DeviseId}/>
              }):null
            }
            </div>
            <div className="baseBlock">
              <div className="textBlock">
                <p>else</p>
              </div>
              <div className="addBlock" onClick={()=>addActBlock("else")}>
                <i className="fas fa-plus"></i>
              </div>
            </div>
            <div className="groupBlockConteiner">
            {
              (cost)?
              script.else.map((item,index)=>{
                return <ActBlock deleteEl={()=>deleteActBlock("else",index)} updata={(data1)=>updatascript("else",data1)} key={index} data={item} index={index} block="else" idDevice={item.DeviseId}/>
              }):
              null
            }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
