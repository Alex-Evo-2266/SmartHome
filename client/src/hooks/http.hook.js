import {useState, useCallback} from 'react'
import { useDispatch} from 'react-redux'
import { login, logout } from '../store/reducers/authReducer.js'

export const useHttp = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async ()=>{
    const response = await fetch("/api/auth/refresh", {method:"GET", body:null, headers:{}});
    const data = await response.json()
    if (!response.ok) {
      dispatch(logout())
      throw new Error(data.message||'что-то пошло не так')
    }
    // await auth.login(data.token, data.userId, data.userLavel)
    dispatch(login(data.token, data.id, data.role, data.expires_at))
    return data.token
  },[dispatch])

  const request = useCallback(async (url, method="GET", body = null, headers = {},file=false) => {
    setLoading(true);
    try {
      if(headers['Authorization'])
      {
        headers['Authorization-Token'] = headers['Authorization']
        // headers['Authorization'] = undefined
      }
      if(body&&!file){
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(body);
      }
      let response = await fetch(url, {method, body, headers});
      if (response.status === 401){
        const token = await refresh()
        headers["Authorization-Token"] = `Bearer ${token}`
        response = await fetch(url, {method, body, headers});
      }
      const data = await response.json()
      if (!response.ok) {
        throw new Error((data)?JSON.stringify(data):'что-то пошло не так')
      }
      setLoading(false);
      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message)
    }
  },[refresh]);

  const clearError = useCallback(() => {setError(null)},[]);

  return {loading, request, error, clearError}
}
