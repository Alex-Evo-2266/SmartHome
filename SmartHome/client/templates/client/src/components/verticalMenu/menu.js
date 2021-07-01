import React, {useContext,useState,useEffect,useCallback,useRef} from 'react'
import {NavLink,Link,useHistory,useLocation} from 'react-router-dom'
import {MenuContext} from './menuContext'
import {AuthContext} from '../../context/AuthContext.js'
import {UserContext} from '../../context/UserContext'
import {TerminalContext} from '../terminal/terminalContext.js'
import {menuField} from './data.menu.js'

export const Menu = ()=>{
  const location = useLocation();
  const history = useHistory()
  const menu = useContext(MenuContext)
  const config = useContext(UserContext)
  const auth = useContext(AuthContext)
  const terminal = useContext(TerminalContext)
  // const [visible, setVisible] = useState(false)
  const bot_menu = useRef(null)
  const [visiblesub, setVisiblesub] = useState(false)
  const [insluedField, setField] = useState([])
  const [otherField, setotherField] = useState([])
  const [sizeWidth, setSizeWidth] = useState(window.innerWidth)

  const giveField=useCallback((data)=>{
    let arr1 = []
    let arr2 = menuField
    for (var item of data) {
      let a = false
      for (var item2 of menuField) {
        if(item.title===item2.title){
          a = true
          let element = item
          arr2 = arr2.filter((item3)=>item3.title!==element.title)
          break
        }
      }
      if(a){
        arr1.push(item)
      }
    }
    return {include:arr1, other:arr2}
  },[])

  useEffect(()=>{
    if(config&&config.MenuElements){
      let data = giveField(config.MenuElements)
      setField(data.include)
      setotherField(data.other)
    }
  },[config,giveField])

const togleVisible=()=>{
  if(!visiblesub)
    menu.togle()
  else {
    menu.togle()
    setVisiblesub(false)
  }
}

const togleVisibleSubmenu=()=>{
  if(menu.menu.visible){
    setVisiblesub(!visiblesub)
  }
  else{
    menu.show()
    setVisiblesub(true)
  }
}

const toprofile = ()=>{
  history.push('/profile')
}


useEffect(()=>{
  window.addEventListener("resize",resizeThrottler)
  var resizeTimeout;
  function resizeThrottler(event) {
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        setSizeWidth(event.target.innerWidth)
       }, 66);
    }
  }
  return ()=>{
    window.removeEventListener("resize", resizeThrottler);
  }
},[])

useEffect(()=>{
  if(bot_menu.current){
    let list = bot_menu.current.querySelectorAll("li")
    for (let i = 0; i < list.length; i++) {
      list[i].onmouseover = (event)=>{
        for (var item of list) {
          item.classList.remove('hover')
        }
        list[i].classList.add('hover')
      }
      list[i].onmouseout=()=>{
        list[i].classList.remove('hover')
      }
    }
  }
  return()=>{
    if(bot_menu.current){
      let list = bot_menu.current.querySelectorAll("li")
      for (let i = 0; i < list.length; i++) {
        list[i].onmouseover = null
        list[i].onmouseout = null
      }
    }
  }
},[])

if(sizeWidth>700){
  bot_menu.current = null
  return(
    <>
    {
      (menu.menu.visible)?
      <div className="fullScrin" onClick={()=>menu.hide()}></div>
      :null
    }
    <div className={`sidebar_menu ${(menu.menu.visible)?"active":""} ${(visiblesub)?"submenuActive":""}`} id="nav">
      <div className="baseMenu">
        <div className="logo-content">
          <div className="logo">
            <i className="fas fa-home"></i>
            <div className="logo-name">SmartHome</div>
          </div>
          <i className="fas fa-bars" id="nav-btn" onClick={togleVisible}></i>
        </div>
        <ul className="navlist">
          <li onClick = {()=>(menu.menu.visible)?togleVisible():null}>
            <NavLink to = "/home" exact>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <button href="#" className="subbtn" onClick={togleVisibleSubmenu}>
              <i className="fas fa-border-all"></i>
              <span>menu</span>
            </button>
          </li>
          <li onClick = {()=>(menu.menu.visible)?togleVisible():null}>
            <NavLink to = "/devices">
              <i className="fas fa-plug"></i>
              <span>Devices</span>
            </NavLink>
          </li>
          <li onClick = {()=>(menu.menu.visible)?togleVisible():null}>
            <NavLink to = "/config">
              <i className="fas fa-cog"></i>
              <span>Options</span>
            </NavLink>
          </li>
          {
            (insluedField)?
            insluedField.map((item,index)=>{
              let t = item.url.indexOf("/")
              if(item.url==="/terminal"){
                return(
                  <li key={index} onClick = {()=>(menu.menu.visible)?togleVisible():null}>
                    <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
                      <i className={item.iconClass}></i>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              }
              return(
                <li key={index} onClick = {()=>(menu.menu.visible)?togleVisible():null}>
                {
                  (t!==0)?
                  <a href = {item.url}>
                    <i className={item.iconClass}></i>
                    <span>{item.title}</span>
                  </a>:
                  <NavLink to = {item.url}>
                    <i className={item.iconClass}></i>
                    <span>{item.title}</span>
                  </NavLink>
                }
                </li>
              )
            })
            :null
          }
        </ul>
        <div className={`profile-content ${(location.pathname==="/profile")?"active":""}`} onClick={toprofile}>
          <div className="profile">
            <div className="profile-details">
              <div className="name-job">
                <div className="name">Alex Evo</div>
                <div className="job">Admin</div>
              </div>
            </div>
            <i className="fas fa-sign-out-alt" onClick={auth.logout}></i>
          </div>
        </div>
      </div>
      <div className={`submenu`}>
        <div className="topMenu">
          <ul>
            <li>
              <i className="fas fa-grip-lines"></i>
            </li>
          </ul>
        </div>
        <div className="subMenuContent">
          <ul>
          {
            (otherField)?
            otherField.map((item,index)=>{
              let t = item.url.indexOf("/")
              if(item.url==="/terminal"){
                return(
                  <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                    <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
                      <i className={item.iconClass}></i>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              }
              return(
                <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                {
                  (t!==0)?
                  <a href = {item.url}>
                    <i className={item.iconClass}></i>
                    <span>{item.title}</span>
                  </a>:
                  <NavLink to = {item.url}>
                    <i className={item.iconClass}></i>
                    <span>{item.title}</span>
                  </NavLink>
                }
                </li>
              )
            })
            :null
          }
          </ul>
        </div>
      </div>
    </div>
    </>
  )
}else {
  return(
    <>
    {
      (visiblesub)?
      <div className="fullScrin" onClick={()=>setVisiblesub(false)}></div>
      :null
    }
    <div className="bottom-navigation">
      <ul ref={bot_menu}>
        <li className={`${(location.pathname==="/config")?"active":""}`}>
          <NavLink to="/config">
            <span className="icon"><i className="fas fa-cog"></i></span>
            <span className="title">Test1</span>
          </NavLink>
        </li>
        <li className={`${(location.pathname==="/profile")?"active":""}`}>
          <NavLink to="/profile">
            <span className="icon"><i className="fas fa-user"></i></span>
            <span className="title">Profile</span>
          </NavLink>
        </li>
        <li className={`${(location.pathname==="/home")?"active":""}`}>
          <NavLink to="/home">
            <span className="icon"><i className="fas fa-home"></i></span>
            <span className="title">Home</span>
          </NavLink>
        </li>
        <li className={`${(visiblesub)?"menuActive":""}`}>
          <button onClick={()=>setVisiblesub(prev=>!prev)}>
            <span className="icon"><i className="fas fa-border-all"></i></span>
            <span className="title">Menu</span>
          </button>
        </li>
        <li className={`${(location.pathname==="/devices")?"active":""}`}>
          <NavLink to="/devices">
            <span className="icon"><i className="fas fa-plug"></i></span>
            <span className="title">Devices</span>
          </NavLink>
        </li>
        <div className="indicator"></div>
        <div className="indicator2"></div>
      </ul>
    </div>
    <div className={`menu-app ${(visiblesub)?"active":""}`}>
      <ul>
        {
          menuField.map((item,index)=>{
            let t = item.url.indexOf("/")
            if(item.url==="/terminal"){
              return(
                <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
                  <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
                    <span className="icon">
                      <i className={item.iconClass}></i>
                    </span>
                    <span className="title">{item.title}</span>
                  </Link>
                </li>
              )
            }
            return(
              <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
              {
                (t!==0)?
                <a href = {item.url}>
                  <span className="icon">
                    <i className={item.iconClass}></i>
                  </span>
                  <span className="title">{item.title}</span>
                </a>:
                <NavLink to = {item.url}>
                  <span className="icon">
                    <i className={item.iconClass}></i>
                  </span>
                  <span className="title">{item.title}</span>
                </NavLink>
              }
              </li>
            )
          })
        }
      </ul>
    </div>
    </>
  )
}

}
