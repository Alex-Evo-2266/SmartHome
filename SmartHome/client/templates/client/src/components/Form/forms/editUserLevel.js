import React,{useState,useContext,useEffect} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const EditUserLevel = ({hide,data})=>{
  const auth = useContext(AuthContext)
  const [level, setLevel] = useState(data.Level)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const changeHandler = (event)=>{
    setLevel(event.target.value)
  }
  const outHandler = async()=>{
    await request(`/api/users/${data.UserId}/level`, 'PUT', {level},{Authorization: `Bearer ${auth.token}`})
    hide();
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <div className = "form small">
      <div className="editDevicesForm moreInput">
        <ul className="editDevice">
          <li>
            <label>
              <h5>{`Name - ${data.UserName}`}</h5>
              <h5>{`UserSurname - ${data.UserSurname}`}</h5>
              <h5>{`Email - ${data.Email}`}</h5>
              <h5>{`Mobile - ${data.Mobile}`}</h5>
            </label>
          </li>
          <li>
            <label>
              <h5>level</h5>
              <select className = "textInput" name="level" value={level} onChange={changeHandler}>
                <option value={1}>Usual</option>
                <option value={3}>Admin</option>
              </select>
            </label>
          </li>
          <div className="controlForm" >
            <button className="formEditBtn" onClick={outHandler}>Save</button>
          </div>
        </ul>
      </div>
    </div>
  )
}
