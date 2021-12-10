import React,{useState,useContext,useEffect,useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {useChecked} from '../hooks/checked.hook'
import {AuthContext} from '../context/AuthContext.js'
import {GroupBlock} from '../components/programmBlock/groupBlock'
import {ActBlock} from '../components/programmBlock/actBlock'
import {ActScript} from '../components/programmBlock/actScript'
import {TriggerBlock} from '../components/programmBlock/triggerBlock'
import {TriggerDateTime} from '../components/programmBlock/triggerDateTime'
import {Loader} from '../components/Loader'
import {AddScriptContext} from '../components/addScript/addScriptContext'
import {MenuContext} from '../components/Menu/menuContext'
import {DelayBlock} from '../components/programmBlock/delayBlock'
import {useHistory,useParams} from 'react-router-dom'

export const NewScriptsPage = ({edit}) => {
  let {id} = useParams();
  const {setData} = useContext(MenuContext)
  const history = useHistory()
  const {USText} = useChecked()
  const auth = useContext(AuthContext)
  const {addTarget,typeAct,deviceBlock,addScriptBlock} = useContext(AddScriptContext)
  const {message} = useMessage();
  const {loading,request, error, clearError} = useHttp();
  const[cost, setCost]=useState(true)
  const[script, setScript]=useState({
    name:"",
    trigger:[],
    if:{type:"group" ,oper:"and",children:[],systemName:null,action:null,value:null},
    then:[],
    else:[]
  })

  const addTrigger = ()=>{
    addTarget((dataDev)=>{
      if(dataDev.type === "datetime")
      {
        let mas = script;
        mas.trigger.push({type:"datetime",action:{frequency:"everyday", time:"00:00:00"}})
        setScript(mas)
        return
      }
      if(!dataDev||!dataDev.systemName)
        return
      let mas = script;
      mas.trigger.push({type:"device",action:"all",systemName:dataDev.systemName})
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
    typeAct((typeAct)=>{
      setTimeout(function () {
        if(typeAct==="device"){
          deviceBlock((dataDev)=>{
            if(!dataDev||!dataDev.systemName)
              return
            let mas = script;
            let act = dataDev.config[0].name
            mas[type].push({type:"device",action:act,systemName:dataDev.systemName})
            setScript(mas)
          })
        }
        if(typeAct==="script"){
          addScriptBlock((datascr)=>{
            if(!datascr||!datascr.name)
              return
            let mas = script;
            mas[type].push({type:"script",action:"run",systemName:datascr.name})
            setScript(mas)
          })
        }
        if(typeAct==="delay"){
          let mas = script[type].slice();
          mas.push({type:"delay",action:"delay",value:{type:"number", value:"0"}})
          setScript({...script, [type]:mas})
        }
      }, 100);
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
    try {
      if(!script.name || !USText(script.name)){
        console.error("allowed characters: 1234567890_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM");
        let el = document.getElementById("scriptName")
        el.style="background:red;"
        message("allowed characters: 1234567890_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM","error")
        return
      }
      let data
      if(edit)
        data = await request(`/api/script/${id}`, 'PUT', {...script},{Authorization: `Bearer ${auth.token}`})
      else
        data = await request('/api/script', 'POST', {...script},{Authorization: `Bearer ${auth.token}`})
      if(data){
        history.push('/scripts')
      }
    } catch (e) {
      console.error(e);
    }
  }

  const updatascript=(type,data)=>{
    let mas = script;
    let components = mas[type].slice()
    let component = components[data.index]
    for (var key in data) {
      if (key!=="index") {
        component[key] = data[key]
      }
    }
    components[data.index] = component
    mas[type] = components
    setScript(mas)
    setCost((prev)=>!prev)
  }

  const updataIfBlock=(data)=>{
    let mas = script;
    mas.if = data
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
    if(!cost)
    setCost(true)
  },[cost])

  const giveScript = useCallback(async(idscript)=>{
    const data = await request(`/api/script/${idscript}`, 'Get', null,{Authorization: `Bearer ${auth.token}`})
    if(data){
      let s = {}
      s.name = data.name
      s.if = data.if
      s.trigger = data.trigger
      s.then = data.then
      s.else = data.else
      setScript(s)
      setCost(prev=>!prev)
    }
  },[auth.token,request])

  useEffect(()=>{
    if(id&&edit){
      giveScript(id)
    }
  },[id,edit,giveScript])

  useEffect(()=>{
    setData("New Script")
  },[script, setData])

  if(loading){
    return(
      <Loader/>
    )
  }

  return(
    <>
      <div className = "NewScripConteiner">
      <h2>Create new script</h2>
        <div className="NewScripPage">
          <div className="scriptOut">
            <p>Script name</p>
            <input type="text" id="scriptName" name="name" value={script.name} onChange={changeHandler}/>
            <button onClick={outHandler}>Save</button>
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
                  if(item?.type === "datetime")
                    return <TriggerDateTime key={index} index={index} action={item.action} updata={(data1)=>updatascript("trigger",data1)} deleteEl={()=>deleteTrigger(index)} block="trigger" deviceId={item.systemName}/>
                  return <TriggerBlock key={index} index={index} action={item.action} updata={(data1)=>updatascript("trigger",data1)} deleteEl={()=>deleteTrigger(index)} block="trigger" deviceId={item.systemName}/>
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
                if(item.type==="device"){
                  return <ActBlock deleteEl={()=>deleteActBlock("then",index)} updata={(data1)=>updatascript("then",data1)} key={index} data={item} index={index} block="then"/>
                }
                if(item.type==="script"){
                  return <ActScript deleteEl={()=>deleteActBlock("then",index)} updata={(data1)=>updatascript("then",data1)} key={index} data={item} index={index} block="then"/>
                }
                if(item.type==="delay"){
                  return <DelayBlock deleteEl={()=>deleteActBlock("then",index)} updata={(data1)=>updatascript("then",data1)} key={index} data={item} index={index} block="then"/>
                }
                return null
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
                if(item.type==="device"){
                  return <ActBlock deleteEl={()=>deleteActBlock("else",index)} updata={(data1)=>updatascript("else",data1)} key={index} data={item} index={index} block="else"/>
                }
                if(item.type==="script"){
                  return <ActScript deleteEl={()=>deleteActBlock("else",index)} updata={(data1)=>updatascript("else",data1)} key={index} data={item} index={index} block="else"/>
                }
                if(item.type==="delay"){
                  return <DelayBlock deleteEl={()=>deleteActBlock("then",index)} updata={(data1)=>updatascript("then",data1)} key={index} data={item} index={index} block="then"/>
                }
                return null
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
