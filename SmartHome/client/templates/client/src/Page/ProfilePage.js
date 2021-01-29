import React, {useContext,useEffect,useState,useCallback} from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {Loader} from '../components/Loader'

export const ProfilePage = () => {
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [newuser, setNewuser] = useState({
    UserName:"",
    UserSurname:"",
    Mobile:"",
    Email:"",
    ImageId:""
  });

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const updataUser = useCallback(async()=>{
    const data = await request(`/api/user`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data) return;
    setUser(data);
    setNewuser({
      UserName:data.UserName,
      UserSurname:data.UserSurname,
      Mobile:data.Mobile,
      Email:data.Email,
      ImageId:data.ImageId
    });
  },[request,auth.token])

  useEffect(()=>{
    updataUser()
  },[updataUser])

  const changeHandler = event => {
    setNewuser({ ...newuser, [event.target.name]: event.target.value })
  }

  const outForm = async () =>{
      const data = await request(`/api/user/edit`, 'POST', {newuser},{Authorization: `Bearer ${auth.token}`})
      if(!data)return;
      setUser(data);
      setNewuser({
        UserName:data.UserName,
        UserSurname:data.UserSurname,
        Mobile:data.Mobile,
        Email:data.Email,
        ImageId:data.ImageId
      });
  }

  return(
    <div className = "conteiner">
        <div className = "pages">
        {
          (loading)?
          <Loader/>:
          <>
          <div className = {`page ${(location.pathname==="/profile")?"active":""}`}>
            <div className = "pagecontent">
              <h2>Profile</h2>
              <p>User Name: {user.UserName}</p>
              <p>User Surname: {user.UserSurname||"NuN"}</p>
              <p>User Email: {user.Email||"NuN"}</p>
              <p>User Mobile: {user.Mobile||"NuN"}</p>
              <p>User Level: {(user.Level===3)?"Admin":(user.Level===2)?"Mid":"Low"}</p>
              <hr/>
              <NavLink to = "/config">Client settings</NavLink>
              <NavLink to = "/profile/edit">Edit profile</NavLink>
            </div>
          </div>
          <div className = {`page ${(location.pathname==="/profile/edit")?"active":""}`}>
            <div className = "pagecontent">
            <h2>Profile</h2>
            <label className="textLabel">
              <p>User Name</p>
              <input placeholder="Name" type = "text" name = "UserName" value = {newuser.UserName} onChange={changeHandler}/>
            </label>
            <label className="textLabel">
              <p>User Surname</p>
              <input placeholder="Surname" type = "text" name = "UserSurname" value = {newuser.UserSurname} onChange={changeHandler}/>
            </label>
            <label className="textLabel">
              <p>User Email</p>
              <input placeholder="Email" type = "email" name = "Email" value = {newuser.Email} onChange={changeHandler}/>
            </label>
            <label className="textLabel">
              <p>User Mobile</p>
              <input placeholder="Mobile" type = "tel" name = "Mobile" value = {newuser.Mobile} onChange={changeHandler}/>
            </label>
            <button onClick={outForm}>Save</button>
            </div>
          </div>
          <ul className = "page-nav">
            <li className = {(location.pathname==="/profile")?"active":""}>
              <NavLink to = "/profile" exact >
                <i className="fas fa-user"></i>
              </NavLink>
            </li>
            <li className = {(location.pathname==="/profile/edit")?"active":""}>
              <NavLink to = "/profile/edit" >
                <i className="fas fa-user-cog"></i>
              </NavLink>
            </li>
          </ul>
          </>
        }
        </div>
      </div>
  )
}
