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
    await request(`/api/users/${data.UserId}/edit/level`, 'POST', {level},{Authorization: `Bearer ${auth.token}`})
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
              <input className = "textInput" placeholder="level" id="level" max="3" min="1" type="number" name="level" value={level} onChange={changeHandler} required/>
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
