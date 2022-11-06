import React, {useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { hideDialog } from '../../store/reducers/dialogReducer'

export const SessionList = () => {

	const {request, error, clearError} = useHttp()
	const auth = useSelector(state=>state.auth)
	const [sessions, setSessions] = useState([])
	const {message} = useMessage()
	const dispatch = useDispatch()

	const getSessions = useCallback(async()=>{
		const data = await request("/api/user/sessions", "GET", null, {Authorization: `Bearer ${auth.token}`})
		if (data)
			setSessions(data)
	},[request, auth.token])

	const deleteSession = useCallback(async(id) =>{
		try{
			await request(`/api/user/sessions/${id}`, "DELETE", null, {Authorization: `Bearer ${auth.token}`})
			dispatch(hideDialog())
		}catch{}
	},[request, auth.token])

	useEffect(()=>{
		getSessions()
	},[getSessions])

	useEffect(()=>{
		message(error,"error")
		return ()=>{
			clearError();
		}
	  },[error,message, clearError])

  return(
	<>
	<div className="card-content content-scrollable">
        {sessions?.map((item, index)=>{
          return(
            <div key={index} className="card-field" >
              <p>auth_type:{item?.auth_type}; expires_at:{item?.expires_at}</p>
			  <div class="field-btn" style={{color:"rgb(221, 0, 0)"}} onClick={()=>deleteSession(item.id)}>x</div>
            </div>
          )
        })}
     </div>
	</>
  )
}
