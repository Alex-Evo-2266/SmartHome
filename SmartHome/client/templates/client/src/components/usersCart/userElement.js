import React,{useContext,useEffect} from 'react'
import userDefault from '../../img/userNuN.png'
import {Link} from 'react-router-dom'
import {FormContext} from '../Form/formContext'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'

export const UserElement = ({user,updata})=>{
  const auth = useContext(AuthContext)
  const form = useContext(FormContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <div className="userElement">
      <div className="content">
        <p>Email: {user.Email}
        <br/>Mobile: {user.Mobile}</p>
        <img alt="user icon" src={userDefault} className="userImg"/>
        <h3>{user.UserName} {user.UserSurname}</h3>
        <div className="control">
        {
          (auth.userLevel===3&&auth.userId!==user.UserId)?
          <button className="editBtn" onClick={()=>{form.show("EditUserLevel",updata,user)}}>Edit</button>:
          null
        }
        {
          (auth.userId===user.UserId)?
          <Link className="editBtn" to="/profile/edit">Edit</Link>:
          (auth.userLevel===3)?
          <button className="deletBtn" onClick={()=>{
            message("Delete user?","dialog",async()=>{
              await request(`/api/users`, 'DELETE', {UserId:user.UserId},{Authorization: `Bearer ${auth.token}`})
              updata()
            },"no")
          }}>delete</button>:
          null
        }
        </div>
      </div>
    </div>
  )
}
