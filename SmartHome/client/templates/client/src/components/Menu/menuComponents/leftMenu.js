import React, {useContext,useState,useEffect,useCallback, useRef} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {NavLink,useHistory,useLocation} from 'react-router-dom'
import {LeftSubMenu} from './leftSubMenu'
import {useHttp} from '../../../hooks/http.hook'
import {UserContext} from '../../../context/UserContext.js'
import {DialogWindowContext} from '../../../components/dialogWindow/dialogWindowContext'
import {useMessage} from '../../../hooks/message.hook'

export const LeftMenu = ({hide,show, visible, insluedField, otherField, user})=>{
  const auth = useContext(AuthContext)
  const history = useHistory()
  const location = useLocation();
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [visibleSubMenu, setVisibleSubMenu] = useState(false);
  const [pages, setPages] = useState([])
  const {page, getData} = useContext(UserContext)
  const dialog = useContext(DialogWindowContext)

  const importCarts = useCallback(async()=>{
    try {
      const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setPages(data2.pages)
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  const togleSubMenu = (path)=>{
    if(location.pathname===path){
      setVisibleSubMenu(!visibleSubMenu);
      show();
    }
  }

  const closeMenu=(e)=>{
    let el = e.target.closest("li[data-el=sub]")
    if(!el)
      hide()
  }

  const allclosev = ()=>{
    hide()
    setVisibleSubMenu(false)
  }

  const changePage = useCallback(async(data)=>{
    await request('/api/user/page', 'POST', {name:data},{Authorization: `Bearer ${auth.token}`})
    hide()
    setTimeout(()=>{
      getData()
    },0)
  },[request, getData, auth.token, hide])

  const addPage = useCallback(async(name)=>{
    await request('/api/homePage/add', 'POST', {name},{Authorization: `Bearer ${auth.token}`})
    setTimeout(()=>{
      getData()
    },0)
  },[request,auth.token,getData])

  const deletePage = useCallback(async(name)=>{
    console.log("del");
    // await request('/api/homePage/delete', 'POST', {name},{Authorization: `Bearer ${auth.token}`})
    // setTimeout(()=>{
    //   getData()
    // },0)
  },[request,auth.token,getData])

  const getPages=()=>{
    let arr = pages.map((item)=>{
      let b = {
        title:item,
        dop:(item !== "basePage")?{
          iconClass:"fas fa-times",
          active:()=>deletePage(item)
        }:null
      }
      if(page === item)
        b.action = true
      else
        b.active = ()=>changePage(item)
      return b
    })
    arr.push({
      title:"create",
      active:()=>dialog.show("text",{
        title:"New page",
        text:"input name newPage",
        placeholder:"name",
        action: addPage
      })
    })
    return arr
  }

  useEffect(()=>{
    importCarts()
  },[importCarts])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <>
    {
      (visible)?
      <div className="backGlass" onClick={allclosev} style={{zIndex:96}}></div>
      :null
    }
    <div onClick={closeMenu} className={`navigationRail ${(visible)?"active":""}`}>
    <ul className="baseMenu">
      <li data-el={(location.pathname==="/home")?"sub":""} onClick={()=>togleSubMenu("/home")}>
        <NavLink to = "/home">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
        <LeftSubMenu visible={visibleSubMenu} buttons={getPages()}/>
      </li>
      <li>
        <NavLink to = "/devices">
          <i className="fas fa-plug"></i>
          <span>Devices</span>
        </NavLink>
      </li>
      <li>
        <NavLink to = "/config">
          <i className="fas fa-cogs"></i>
          <span>Options</span>
        </NavLink>
      </li>
      {
        (insluedField)?
        insluedField.map((item,index)=>{
          let t = item.url.indexOf("/")
          return(
            <li key={index}>
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
        }):null
      }
    </ul>
    {
      (visible)?
      <>
      <div className="dividers"></div>
      <ul className="otherMenu">
      {
        (otherField)?
        otherField.map((item,index)=>{
          let t = item.url.indexOf("/")
          return(
            <li key={index}>
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
        }):null
      }
      </ul>

      <div className="bottomField">
        <div className="dividers"></div>
        <div className="profifileConteiner">
          <div className="out" onClick={auth.logout}>
            <i className="fas fa-sign-out-alt" onClick={auth.logout}></i>
          </div>
          <div className="profile" onClick={()=>history.push("/profile")}>
            <div className="name">{user.UserName} {user.UserSurname}</div>
            <div className="email">{user.Email}</div>
          </div>
        </div>
      </div>
      </>
      :null
    }
    </div>
    </>
  )
}
