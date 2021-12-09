import React, {useContext,useState,useEffect,useCallback} from 'react'
import {MenuContext} from './menuContext'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {UserContext} from '../../context/UserContext'
import {FloatingButton} from '../floatingButton'
import {LeftMenu} from './menuComponents/leftMenu'
import {TopMenu} from './menuComponents/topMenu'
import {DialogWindowContext} from '../dialogWindow/dialogWindowContext'
import {BottomMenu} from './menuComponents/bottomMenu'
// import {TerminalContext} from '../terminal/terminalContext.js'
import {menuField} from './data.menu.js'


export const Menu = ()=>{
  const menu = useContext(MenuContext)
  const {request} = useHttp();
  const config = useContext(UserContext)
  const auth = useContext(AuthContext)
  const dialog = useContext(DialogWindowContext)
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
    for (let item of data) {
      arr2 = arr2.filter((item3)=>item3.title!==item.title)
      arr1.push(item)
    }
    if(auth.userLevel >= 3)
      arr2.push({title:"Users",iconClass:"fas fa-users",url:"/users"})
    return {include:arr1, other:arr2}
  },[auth.userLevel])

  useEffect(()=>{
    if(config.MenuElements){
      let data = giveField(config.MenuElements)
      setField(data.include)
      setotherField(data.other)
    }
  },[config.MenuElements,giveField])

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

  const dialogSearcht = (func)=>{
    if(!searchtVisible){
      dialog.show("text", {
        title:"Search",
        placeholder:"name",
        active:(d)=>{
          if(typeof(func)==="function")
            func(d)
          setSearchtVisible(false)
        }
      })
    }else{
      dialog.hide()
    }
    setSearchtVisible(!searchtVisible)
  }

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
      search:(menu.menu.search)?{togle:()=>dialogSearcht(menu.menu.search)}:null,
      dopmenu:menu.menu.dopmenu
    }}
    />
    </>
  )
}
}
