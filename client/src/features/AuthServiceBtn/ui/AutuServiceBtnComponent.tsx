import { useCallback, useEffect, useRef } from 'react'
import {AuthBtn, IAuthBtn} from "./AuthServiceBtn"
import { login } from '../../../entites/User'
import { getClientId } from '../api/getClientId'
import { getToken } from '../api/getToken'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'

export const AuthServiceBtn = ()=>{
  const authBtn = useRef<HTMLDivElement>(null)
  const authBtnController = useRef<IAuthBtn | undefined>(undefined)
  const dispatch = useAppDispatch()
  const loading = useRef<boolean>(false)

  const userLogin = useCallback(async(code: string)=>{
    console.log("code", code)
    const data = await getToken(code)
    console.log("res", data)
    if (!data)
      return;
    dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
  },[dispatch])

  const AuthBtnInit = useCallback(async() => {
    if(authBtnController.current || loading.current)
      return;
    loading.current = true
    const data = await getClientId()
    loading.current = false
    if (!data || !authBtn.current)
      return;
    authBtnController.current = AuthBtn(authBtn.current, {
      host: data.host,
      client_id: data.clientId,
      onSaccess: userLogin,
      width: 250
    })
  },[userLogin, loading])


  useEffect(()=>{
    AuthBtnInit()
    return ()=>{
      if (authBtnController.current)
      {
        authBtnController.current.destroy()
        authBtnController.current = undefined
      }
    }
  },[AuthBtnInit])

  return(
    <div ref={authBtn} id="auth-service" className='auth-btn-containeer'></div>
  )
}
