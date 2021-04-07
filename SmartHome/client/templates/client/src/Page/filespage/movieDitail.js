import React,{useEffect,useState,useContext,useCallback} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const MovieDitail = (type="movie")=>{
  const auth = useContext(AuthContext)
  const {id} = useParams();
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [movie, setMovie] = useState({})

  const getData = useCallback(async()=>{
    const data = await request(`/api/files/movie/${id}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  },[])

  useEffect(()=>{
    getData()
  },[getData])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return (
    <div className="movie-ditail">

    </div>
  )
}
