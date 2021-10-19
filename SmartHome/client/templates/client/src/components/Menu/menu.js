import React, {useContext,useState,useEffect,useCallback} from 'react'
import {MenuContext} from './menuContext'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {UserContext} from '../../context/UserContext'
import {FloatingButton} from '../floatingButton'
import {LeftMenu} from './menuComponents/leftMenu'
import {TopMenu} from './menuComponents/topMenu'
import {BottomMenu} from './menuComponents/bottomMenu'

// import {TerminalContext} from '../terminal/terminalContext.js'
import {menuField} from './data.menu.js'


export const Menu = ()=>{
  const menu = useContext(MenuContext)
  const {request} = useHttp();
  const config = useContext(UserContext)
  const auth = useContext(AuthContext)
  // const terminal = useContext(TerminalContext)
  const [user, setuser] = useState({
    UserName:"",
    UserSurname:"",
    Mobile:"",
    Email:"",
    ImageId:""
  });
  const [search, setSearch] = useState("")
  const [searchtVisible, setSearchtVisible] = useState(false)
  const [insluedField, setField] = useState([])
  const [otherField, setotherField] = useState([])
  const [sizeWidth, setSizeWidth] = useState(window.innerWidth)

  useEffect(()=>{
    window.addEventListener("resize",resizeThrottler)
    function resizeThrottler(event) {
      setSizeWidth(event.target.innerWidth)
    }
    return ()=>{
      window.removeEventListener("resize", resizeThrottler);
    }
  },[])

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

  const updataUser = useCallback(async()=>{
    const data = await request(`/api/user`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data) return;
    setuser({
      UserName:data.UserName,
      UserSurname:data.UserSurname,
      Mobile:data.Mobile,
      Email:data.Email,
      ImageId:data.ImageId
    });
  },[request,auth.token])

  const searchHandler = event => {
    setSearch(event.target.value)
  }

  const keyd = (e)=>{
    if(e.keyCode===13&&typeof(menu.menu.search)==="function"){
      menu.menu.search(search)
    }
  }

  const searchtVisibleTogle = ()=>setSearchtVisible(!searchtVisible)

  useEffect(()=>{
    updataUser()
  },[updataUser])

if(sizeWidth>700){
  return(
    <>
    {
      (menu.menu.specialAction?.type)?
      <FloatingButton
      title={menu.menu.specialAction?.title || menu.menu.specialAction?.type}
      type = {menu.menu.specialAction?.type}
      action = {menu.menu.specialAction?.action}
      />:
      null
    }
    <TopMenu
    title={menu.menu.title}
    togle={menu.togle}
    controlButtons={{
      search:(menu.menu.search)?{togle:searchtVisibleTogle}:null,
      dopmenu:menu.menu.dopmenu
    }}
    buttons={menu.menu.buttons}
    />
    {
      (menu.menu.search)?
      <div className={`toolbarConteainer ${(searchtVisible)?"show":"hide"}`}>
        <div className={`search`}>
          <button onClick={()=>setSearchtVisible(false)} className="backBtn">
            <i className="fas fa-arrow-left"></i>
          </button>
          <input placeholder="search" type="search" name="search" onChange={searchHandler} onKeyDown={keyd} value={search}/>
        </div>
      </div>:
      null
    }
    <LeftMenu
    user={user}
    hide={menu.hide}
    show={menu.show}
    visible={menu.menu.visible}
    insluedField={insluedField}
    otherField={otherField}
    />
    </>
  )
}
else {
  return (
    <>
    {
      (menu.menu.specialAction?.type)?
      <FloatingButton
      title={menu.menu.specialAction?.title || menu.menu.specialAction?.type}
      big={menu.menu.visible} type = {menu.menu.specialAction?.type}
      action = {menu.menu.specialAction?.action}
      />:
      null
    }
    {
      (menu.menu.buttons)?
      <TopMenu
      buttons={menu.menu.buttons}
      />
      :null
    }
    <BottomMenu
    hide={menu.hide}
    togle={menu.togle}
    visible={menu.menu.visible}
    insluedField={insluedField}
    otherField={otherField}
    controlButtons={{
      search:(menu.menu.search)?{togle:searchtVisibleTogle}:null,
      dopmenu:menu.menu.dopmenu
    }}
    />
    </>
  )
}


// if(sizeWidth>700){
//   bot_menu.current = null
//   return(
//     <>
//     {
//       (menu.menu.visible)?
//       <div className="fullScrin" onClick={()=>menu.hide()}></div>
//       :null
//     }
//     <div className={`sidebar_menu ${(menu.menu.visible)?"active":""} ${(visiblesub)?"submenuActive":""}`} id="nav">
//       <div className="baseMenu">
//         <div className="logo-content">
//           <div className="logo">
//             <i className="fas fa-home"></i>
//             <div className="logo-name">SmartHome</div>
//           </div>
//           <i className="fas fa-bars" id="nav-btn" onClick={togleVisible}></i>
//         </div>
//         <ul className="navlist">
//           <li onClick = {()=>(menu.menu.visible)?togleVisible():null}>
//             <NavLink to = "/home" exact>
//               <i className="fas fa-home"></i>
//               <span>Home</span>
//             </NavLink>
//           </li>
//           <li>
//             <button href="#" className="subbtn" onClick={togleVisibleSubmenu}>
//               <i className="fas fa-border-all"></i>
//               <span>menu</span>
//             </button>
//           </li>
//           <li onClick = {()=>(menu.menu.visible)?togleVisible():null}>
//             <NavLink to = "/devices">
//               <i className="fas fa-plug"></i>
//               <span>Devices</span>
//             </NavLink>
//           </li>
//           <li onClick = {()=>(menu.menu.visible)?togleVisible():null}>
            // <NavLink to = "/config">
            //   <i className="fas fa-cog"></i>
            //   <span>Options</span>
            // </NavLink>
//           </li>
//           {
//             (insluedField)?
//             insluedField.map((item,index)=>{
//               let t = item.url.indexOf("/")
//               if(item.url==="/terminal"){
//                 return(
//                   <li key={index} onClick = {()=>(menu.menu.visible)?togleVisible():null}>
//                     <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
//                       <i className={item.iconClass}></i>
//                       <span>{item.title}</span>
//                     </Link>
//                   </li>
//                 )
//               }
//               return(
//                 <li key={index} onClick = {()=>(menu.menu.visible)?togleVisible():null}>
//                 {
//                   (t!==0)?
//                   <a href = {item.url}>
//                     <i className={item.iconClass}></i>
//                     <span>{item.title}</span>
//                   </a>:
//                   <NavLink to = {item.url}>
//                     <i className={item.iconClass}></i>
//                     <span>{item.title}</span>
//                   </NavLink>
//                 }
//                 </li>
//               )
//             })
//             :null
//           }
//         </ul>
//         <div className={`profile-content ${(location.pathname==="/profile")?"active":""}`} onClick={toprofile}>
//           <div className="profile">
//             <div className="profile-details">
//               <div className="name-job">
//                 <div className="name">Alex Evo</div>
//                 <div className="job">Admin</div>
//               </div>
//             </div>
//             <i className="fas fa-sign-out-alt" onClick={auth.logout}></i>
//           </div>
//         </div>
//       </div>
//       <div className={`submenu`}>
//         <div className="topMenu">
//           <ul>
//             <li>
//               <i className="fas fa-grip-lines"></i>
//             </li>
//           </ul>
//         </div>
//         <div className="subMenuContent">
//           <ul>
//           {
//             (otherField)?
//             otherField.map((item,index)=>{
//               let t = item.url.indexOf("/")
//               if(item.url==="/terminal"){
//                 return(
//                   <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
//                     <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
//                       <i className={item.iconClass}></i>
//                       <span>{item.title}</span>
//                     </Link>
//                   </li>
//                 )
//               }
//               return(
//                 <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
//                 {
//                   (t!==0)?
//                   <a href = {item.url}>
//                     <i className={item.iconClass}></i>
//                     <span>{item.title}</span>
//                   </a>:
//                   <NavLink to = {item.url}>
//                     <i className={item.iconClass}></i>
//                     <span>{item.title}</span>
//                   </NavLink>
//                 }
//                 </li>
//               )
//             })
//             :null
//           }
//           </ul>
//         </div>
//       </div>
//     </div>
//     </>
//   )
// }else {
//   return(
//     <>
//     {
//       (visiblesub)?
//       <div className="fullScrin" onClick={()=>setVisiblesub(false)}></div>
//       :null
//     }
//     <div className="bottom-navigation">
//       <ul ref={bot_menu}>
//         <li className={`${(location.pathname==="/config")?"active":""}`}>
//           <NavLink to="/config">
//             <span className="icon"><i className="fas fa-cog"></i></span>
//             <span className="title">Test1</span>
//           </NavLink>
//         </li>
//         <li className={`${(location.pathname==="/profile")?"active":""}`}>
//           <NavLink to="/profile">
//             <span className="icon"><i className="fas fa-user"></i></span>
//             <span className="title">Profile</span>
//           </NavLink>
//         </li>
//         <li className={`${(location.pathname==="/home")?"active":""}`}>
//           <NavLink to="/home">
//             <span className="icon"><i className="fas fa-home"></i></span>
//             <span className="title">Home</span>
//           </NavLink>
//         </li>
//         <li className={`${(visiblesub)?"menuActive":""}`}>
//           <button onClick={()=>setVisiblesub(prev=>!prev)}>
//             <span className="icon"><i className="fas fa-border-all"></i></span>
//             <span className="title">Menu</span>
//           </button>
//         </li>
//         <li className={`${(location.pathname==="/devices")?"active":""}`}>
//           <NavLink to="/devices">
//             <span className="icon"><i className="fas fa-plug"></i></span>
//             <span className="title">Devices</span>
//           </NavLink>
//         </li>
//         <div className="indicator"></div>
//         <div className="indicator2"></div>
//       </ul>
//     </div>
//     <div className={`menu-app ${(visiblesub)?"active":""}`}>
//       <ul>
//         {
//           menuField.map((item,index)=>{
//             let t = item.url.indexOf("/")
//             if(item.url==="/terminal"){
//               return(
//                 <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
//                   <Link to = "#" className={(terminal.terminal.visible)?"active":""} onClick={()=>terminal.target()}>
//                     <span className="icon">
//                       <i className={item.iconClass}></i>
//                     </span>
//                     <span className="title">{item.title}</span>
//                   </Link>
//                 </li>
//               )
//             }
//             return(
//               <li key={index} onClick = {()=>(menu.menu.visible)?menu.togle():null}>
//               {
//                 (t!==0)?
//                 <a href = {item.url}>
//                   <span className="icon">
//                     <i className={item.iconClass}></i>
//                   </span>
//                   <span className="title">{item.title}</span>
//                 </a>:
//                 <NavLink to = {item.url}>
//                   <span className="icon">
//                     <i className={item.iconClass}></i>
//                   </span>
//                   <span className="title">{item.title}</span>
//                 </NavLink>
//               }
//               </li>
//             )
//           })
//         }
//       </ul>
//     </div>
//     </>
//   )
// }

}
