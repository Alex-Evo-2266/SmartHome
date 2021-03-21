import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {Loader} from '../../Loader'
import {MenuComponent} from './menuOptionComponents/component'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const MenuOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)

  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [useBlock,setUseBlock] = useState([])
  const [noUseBlock,setNoUseBlock] = useState([])
  const [paragraphs] = useState([
    {title:"Scripts",icon:"fas fa-code-branch",url:"/scripts"},
    {title:"Nas",icon:"fas fa-hdd",url:"/nas"},
    {title:"Files",icon:"fas fa-file",url:"/files"},
    {title:"Terminal",icon:"fas fa-terminal",url:"/terminal"},
  ])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const configHandler = async(event)=>{
    await request(`/api/user/menu/edit`, 'POST', useBlock,{Authorization: `Bearer ${auth.token}`})
    window.location.reload();
  }

  const updataConf = useCallback(async()=>{
    if(!config||!config.MenuElements)return;
    let newarr = paragraphs
    let newarr2 = []
    for (var item of config.MenuElements) {
      let y = item
      let x = newarr.filter((item2)=>item2.title===y.title)
      if(x)
        newarr2.push(x[0])
      newarr = newarr.filter((item2)=>item2.title!==y.title)
    }
    setNoUseBlock(newarr)
    setUseBlock(newarr2)
  },[config,paragraphs])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  const addParagraph = (title,icon,url)=>{
    let usearr = useBlock
    let nousearr = noUseBlock
    usearr.push({title,icon,url})
    nousearr = nousearr.filter((item)=>item.title!==title)
    setNoUseBlock(nousearr)
    setUseBlock(usearr)
  }

  const deleteParagraph = (title,icon,url)=>{
    let usearr = useBlock
    let nousearr = noUseBlock
    nousearr.push({title,icon,url})
    usearr = usearr.filter((item)=>item.title!==title)
    setNoUseBlock(nousearr)
    setUseBlock(usearr)
  }

  if(loading){
    return <Loader/>
  }

  return(
    <div className = "pagecontent">
      <div className="configElement">
        <MenuComponent name="Home" icon="fas fa-home" def={true}/>
        <MenuComponent name="Devices" icon="fas fa-plug" def={true}/>
        <MenuComponent name="Profile" icon="fas fa-user-circle" def={true}/>
        <MenuComponent name="Option" icon="fas fa-cog" def={true}/>
        {
          useBlock.map((item,index)=>{
            return(
              <MenuComponent key={index} name={item.title} url={item.url} icon={item.icon} onClick={deleteParagraph} use={true}/>
            )
          })
        }
        <br/><hr/><br/>
        {
          noUseBlock.map((item,index)=>{
            return(
              <MenuComponent key={index} name={item.title} url={item.url} onClick={addParagraph} icon={item.icon}/>
            )
          })
        }
      </div>
      <button onClick={configHandler}>Save</button>
    </div>
)
}
