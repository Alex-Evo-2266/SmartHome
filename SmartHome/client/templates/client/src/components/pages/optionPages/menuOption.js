import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {ModalWindow} from '../../modalWindow/modalWindow'
import {Loader} from '../../Loader'
import {MenuComponent} from './menuOptionComponents/component'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {menuField} from '../../verticalMenu/data.menu.js'

export const MenuOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)

  const {message} = useMessage();
  const [visible,setVisible] = useState(false)
  const {loading, request, error, clearError} = useHttp();
  const [useBlock,setUseBlock] = useState([])
  const [noUseBlock,setNoUseBlock] = useState([])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const configHandler = async(event)=>{
    await request(`/api/user/menu`, 'PUT', useBlock,{Authorization: `Bearer ${auth.token}`})
    setTimeout(function () {
      config.updateConfig()
    }, 200);
  }

  const updataConf = useCallback(async()=>{
    if(!config||!config.MenuElements)return;
    let newarr = menuField
    let newarr2 = config.MenuElements
    for (var item of config.MenuElements) {
      let y = item
      newarr = newarr.filter((item2)=>item2.title!==y.title)
    }
    setNoUseBlock(newarr)
    setUseBlock(newarr2)
  },[config])

  useEffect(()=>{
  },[config,useBlock])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  const addParagraph = (title,icon,url)=>{
    let usearr = useBlock
    let nousearr = noUseBlock
    usearr.push({title,iconClass:icon,url})
    nousearr = nousearr.filter((item)=>item.title!==title)
    setNoUseBlock(nousearr)
    setUseBlock(usearr)
  }

  const deleteParagraph = (title,icon,url)=>{
    let usearr = useBlock
    let nousearr = noUseBlock
    for (var item of menuField) {
      if(item.title === title){
        nousearr.push({title,iconClass:icon,url})
        usearr = usearr.filter((item)=>item.title!==title)
        setNoUseBlock(nousearr)
        setUseBlock(usearr)
        return
      }
    }
    usearr = usearr.filter((item)=>item.title!==title)
    setUseBlock(usearr)
  }

  const addlink=()=>{
    let title = document.getElementById('titlelink')
    let icon = document.getElementById('titleicon')
    let url = document.getElementById('titleurl')
    addParagraph(title.value,icon.value,url.value)
    setVisible(false)
  }

  if(loading){
    return <Loader/>
  }

  return(
    <>
    {
      (visible)?
      <ModalWindow hide={()=>setVisible(false)} title="add" zindex={6} className="createLinkWindow">
        <div className="createLink">
          <div className="fieldLinc">
            <p>title</p>
            <input id="titlelink" type = "text" name = "title"/>
          </div>
          <div className="fieldLinc">
            <p>icon</p>
            <input id="titleicon" type = "text" name = "icon"/>
          </div>
          <div className="fieldLinc">
            <p>url</p>
            <input id="titleurl" type = "text" name = "url"/>
          </div>
          <div className="fieldLinc">
            <input type = "button" value="сохранить" onClick={addlink}/>
          </div>
        </div>
      </ModalWindow>
      :null
    }
    <div className = "pagecontent">
      <div className="configElement block">
        <MenuComponent name="Home" icon="fas fa-home" def={true}/>
        <MenuComponent name="Devices" icon="fas fa-plug" def={true}/>
        <MenuComponent name="Profile" icon="fas fa-user-circle" def={true}/>
        <MenuComponent name="Option" icon="fas fa-cog" def={true}/>
        {
          useBlock.map((item,index)=>{
            return(
              <MenuComponent key={index} name={item.title} url={item.url} icon={item.iconClass} onClick={deleteParagraph} use={true}/>
            )
          })
        }
        <div className="menu-component-paragraph" onClick={()=>setVisible(true)}>
          <p>Создать ссылку</p>
          <div className="menu-component-btn">
            <i className="fas fa-plus-circle" style={{color:"#aaa"}}></i>
          </div>
        </div>
        <br/><hr/><br/>
        {
          noUseBlock.map((item,index)=>{
            return(
              <MenuComponent key={index} name={item.title} url={item.url} onClick={addParagraph} icon={item.iconClass}/>
            )
          })
        }
      </div>
      <button onClick={configHandler}>Save</button>
    </div>
    </>
)
}
