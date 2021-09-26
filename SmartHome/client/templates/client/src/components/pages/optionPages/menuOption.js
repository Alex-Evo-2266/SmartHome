import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {ModalWindow} from '../../modalWindow/modalWindow'
import {Loader} from '../../Loader'
import {StyleContext} from '../../UserStyle/StyleContext'
import {MenuComponent} from './menuOptionComponents/component'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {menuField} from '../../Menu/data.menu.js'

export const MenuOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)
  const {styles, updateConfig} = useContext(StyleContext)

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
      updateConfig()
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
      <ModalWindow moving={false} hide={()=>setVisible(false)} title="add" zindex={6} className="createLinkWindow">
        <div className="createLink">
          <div className="configElement">
            <div className="input-data">
              <input required id="titlelink" type = "text" name = "title"/>
              <label>title</label>
            </div>
          </div>
          <div className="configElement">
            <div className="input-data">
              <input required id="titleicon" type = "text" name = "icon"/>
              <label>icon</label>
            </div>
          </div>
          <div className="configElement">
            <div className="input-data">
              <input required id="titleurl" type = "text" name = "url"/>
              <label>title</label>
            </div>
          </div>
          <div className="configElement">
            <button className="normalSelection button" onClick={addlink}>Save</button>
          </div>
        </div>
      </ModalWindow>
      :null
    }
    <div className = "pagecontent">
      <div className="configElement">
        <MenuComponent name="Home" icon="fas fa-home" def={true}/>
      </div>
      <div className="configElement">
        <MenuComponent name="Devices" icon="fas fa-plug" def={true}/>
      </div>
      <div className="configElement">
        <MenuComponent name="Profile" icon="fas fa-user-circle" def={true}/>
      </div>
      <div className="configElement">
        <MenuComponent name="Setings" icon="fas fa-cogs" def={true}/>
      </div>
        {
          useBlock.map((item,index)=>{
            return(
              <div key={index} className="configElement">
              <MenuComponent key={index} name={item.title} url={item.url} icon={item.iconClass} onClick={deleteParagraph} use={true}/>
              </div>
            )
          })
        }
        <div className="configElement">

        <div className="menu-component-paragraph" onClick={()=>setVisible(true)}>
          <p>Создать ссылку</p>
          <div className="menu-component-btn">
            <i className="fas fa-plus-circle" style={{color:"#aaa"}}></i>
          </div>
        </div>
        </div>
        <div className="dividers"></div>
        {
          noUseBlock.map((item,index)=>{
            return(
              <div key={index} className="configElement">
                <MenuComponent key={index} name={item.title} url={item.url} onClick={addParagraph} icon={item.iconClass}/>
              </div>
            )
          })
        }
      <div className="dividers"></div>
      <div className="configElement block">
        <button style={{width: "100%"}} className="normalSelection button" onClick={configHandler}>Save</button>
      </div>
    </div>
    </>
)
}
