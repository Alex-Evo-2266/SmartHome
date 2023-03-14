import React, {useContext,useEffect,useState,useCallback} from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {MenuContext} from '../components/Menu/menuContext'
import {Loader} from '../components/Loader'

export const ProfilePage = () => {
  const auth = useContext(AuthContext)
  const {setData} = useContext(MenuContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [newuser, setNewuser] = useState({
    UserName:"",
    UserSurname:"",
    Mobile:"",
    Email:"",
    ImageId:0
  });
  const [password, setPassword] = useState({
    Old:"",
    New:""
  });

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const updataUser = useCallback(async()=>{
    const data = await request(`/api/user/get`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data) return;
    setUser(data);
    setNewuser({
      UserName:data.UserName||"",
      UserSurname:data.UserSurname||"",
      Mobile:data.Mobile||"",
      Email:data.Email||"",
      ImageId:data.ImageId||0
    });
  },[request,auth.token])

  useEffect(()=>{
    updataUser()
  },[updataUser])

  const changeHandler = event => {
    setNewuser({ ...newuser, [event.target.name]: event.target.value })
  }
  const changePassHandler = event => {
    setPassword({ ...password, [event.target.name]: event.target.value })
  }

  const outForm = async () =>{
      const data = await request(`/api/user/edit`, 'POST', newuser,{Authorization: `Bearer ${auth.token}`})
      if(data === "ok"){
        updataUser()
      }
  }

  const outPassForm = async () =>{
    await request(`/api/user/password/edit`, 'POST', {...password},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    setData("Profile")
  },[setData])

  return(
    <div className = "fullScrinContainer color-normal">
        <div className = "pages">
        {
          (loading)?
          <Loader/>:
          <>
          <div className = {`page ${(location.pathname==="/profile")?"active":""}`}>
            <i className="fas fa-sign-out-alt logout-btn" onClick={auth.logout}></i>
            <div className = "pagecontent">
              <h2>Profile</h2>
              <p>User Name: {user.UserName}</p>
              <p>User Surname: {user.UserSurname||"NuN"}</p>
              <p>User Email: {user.Email||"NuN"}</p>
              <p>User Mobile: {user.Mobile||"NuN"}</p>
              <p>User Level: {(user.Level===3)?"Admin":(user.Level===2)?"Mid":"Low"}</p>
              <div className="dividers"></div>
              <div className="controlElement">
                <NavLink to = "/config" className="normalSelection button">Client settings</NavLink>
                <NavLink to = "/profile/edit" className="normalSelection button">Edit profile</NavLink>
                <NavLink to = "/profile/editPass" className="normalSelection button">Edit password</NavLink>
              </div>
            </div>
          </div>
          <div className = {`page ${(location.pathname==="/profile/edit")?"active":""}`}>
            <div className = "pagecontent">
            <h2>Profile</h2>
            <div className="configElement">
              <div className="input-data">
                <input onChange={changeHandler} required name="UserName" type="text" value={newuser.UserName}></input>
                <label>Name</label>
              </div>
            </div>
            <div className="configElement">
              <div className="input-data">
                <input onChange={changeHandler} required name="UserSurname" type="text" value={newuser.UserSurname}></input>
                <label>Surname</label>
              </div>
            </div>
            <div className="configElement">
              <div className="input-data">
                <input onChange={changeHandler} required name="Email" type="email" value={newuser.Email}></input>
                <label>Email</label>
              </div>
            </div>
            <div className="configElement">
              <div className="input-data">
                <input onChange={changeHandler} required name="Mobile" type="tel" value={newuser.Mobile}></input>
                <label>Mobile</label>
              </div>
            </div>
            <div className="dividers"></div>
            <div className="configElement block">
              <button style={{width: "100%"}} className="normalSelection button" onClick={outForm}>Save</button>
            </div>
            </div>
          </div>
          <div className = {`page ${(location.pathname==="/profile/editPass")?"active":""}`}>
            <div className = "pagecontent">
              <h2>Change password</h2>
              <p>Name: {user.UserName}</p>
              <div className="configElement">
                <div className="input-data">
                  <input onChange={changePassHandler} required name="Old" type="password" value={password.Old}></input>
                  <label>Old password</label>
                </div>
              </div>
              <div className="configElement">
                <div className="input-data">
                  <input onChange={changePassHandler} required name="New" type="password" value={password.New}></input>
                  <label>New password</label>
                </div>
              </div>
              <div className="dividers"></div>
              <div className="configElement block">
                <button style={{width: "100%"}} className="normalSelection button" onClick={outPassForm}>Save</button>
              </div>
            </div>
          </div>
          </>
        }
        </div>
      </div>
  )
}
