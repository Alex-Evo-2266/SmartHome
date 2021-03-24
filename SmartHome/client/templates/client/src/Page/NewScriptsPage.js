import React,{useState,useContext,useCallback,useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {useChecked} from '../hooks/checked.hook'
import {AuthContext} from '../context/AuthContext.js'
import {AddScriptBase} from '../components/addScript/addScriptBase'
import {GroupBlock} from '../components/moduls/programmBlock/groupBlock'
import {ActBlock} from '../components/moduls/programmBlock/actBlock'
import {TriggerBlock} from '../components/moduls/programmBlock/triggerBlock'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
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
  const[devices, setDevices]=useState([])
  const[cost, setCost]=useState(true)
  const[script, setScript]=useState({
    name:"",
    trigger:[],
    if:{oper:"and",ifElement:[]},
    then:[],
    else:[]
  })

  const addTrigger = ()=>{
    show("triggerBlock",(none,dataDev)=>{
      console.log(script)
      if(!dataDev||!dataDev.DeviceId)
        return
      let mas = script;
      mas.trigger.push({type:"device",DeviseId:dataDev.DeviceId})
      setScript(mas)
    })
  }

  const deleteTrigger = (index)=>{
    console.log(script,index);
    if(!script||!script.trigger)
      return
    let mas = script;
    mas.trigger = mas.trigger.filter((_,i)=>i!==index)
    setScript(mas)
    console.log(mas);
    setCost((prev)=>!prev)
  }

  const addEl = (type)=>{

  }

  const deleteEl = (type,index)=>{

  }

  const changeHandler = (event)=>{
    setScript({...script,[event.target.name]:event.target.value})
  }

  const outHandler = async()=>{
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
                  return <TriggerBlock key={index} deleteEl={()=>deleteTrigger(index)} index={index} block="trigger" deviceId={item.DeviseId}/>
                }):null
              }
            </div>
            <div className="baseBlock">
              <div className="textBlock">
                <p>if</p>
              </div>
            </div>
            {
              (script.if.ifElement&&cost)?
                <GroupBlock index = {"1"} type={script.if.oper} elements={script.if}/>
              :null
            }
            <div className="baseBlock">
              <div className="textBlock">
                <p>then</p>
              </div>
              <div className="addBlock" onClick={()=>addEl("then")}>
                <i className="fas fa-plus"></i>
              </div>
            </div>
            <div className="groupBlockConteiner">
            {
              (cost)?
              script.then.map((item,index)=>{
                return <ActBlock deleteEl={()=>deleteEl("then",index)} key={index} el={item} index={index} block="then" deviceId={item.deviceId}/>
              }):null
            }
            </div>
            <div className="baseBlock">
              <div className="textBlock">
                <p>else</p>
              </div>
              <div className="addBlock" onClick={()=>addEl("else")}>
                <i className="fas fa-plus"></i>
              </div>
            </div>
            <div className="groupBlockConteiner">
            {
              (cost)?
              script.else.map((item,index)=>{
                return <ActBlock deleteEl={deleteEl} key={index} el={item} index={index} block="else" deviceId={item.deviceId}/>
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
