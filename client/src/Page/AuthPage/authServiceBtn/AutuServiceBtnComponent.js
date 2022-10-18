import React, { useCallback, useEffect, useRef } from 'react'
import {AuthBtn} from "./AuthServiceBtn"
import {useHttp} from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { useDispatch } from 'react-redux'
import { LOGIN } from '../../../store/types'

export const AuthServiceBtn = ()=>{
  const authBtn = useRef(null)
  const authBtnController = useRef(null)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const dispatch = useDispatch()

  const getAccess = useCallback(async(code)=>{
    const data = await request('/api/auth', 'POST', {"code": code})
    console.log(data)
    if (!data) return ;
    dispatch({type: LOGIN, payload:{
      id: data?.id,
      role: data?.role,
      token: data?.token
    }})
  },[request, dispatch])

  const getClientId = useCallback(async () => {
    const data = await request('/api/auth/clientid', 'GET', null)
    if (data)
    {
      console.log(data)
      authBtnController.current = AuthBtn(authBtn.current, {
        host: data.host, 
        client_id: data.clientId, 
        onSaccess:getAccess
      })
    }
  },[request, getAccess])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getClientId()
    return ()=>{
      if (authBtnController.current)
        authBtnController.current.destroy()
    }
  },[getClientId])

  return(
    <div ref={authBtn} id="auth-service" className='auth-btn-containeer'></div>
  )
}
