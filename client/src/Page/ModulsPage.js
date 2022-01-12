import React,{useState, useEffect, useCallback, useContext} from 'react'
import {AuthContext} from '../context/AuthContext.js'
import {useMessage} from '../hooks/message.hook'
import {useHttp} from '../hooks/http.hook'
import {useParams} from 'react-router-dom'
import {MenuContext} from '../components/Menu/menuContext'
import {Page} from './modulsPageComponents/page'

export const ModulsPage = () => {
  const auth = useContext(AuthContext)
  let {name} = useParams();
  const [dataPage, setDataPage] = useState({})
  const [dataActivePage, setDataActivePage] = useState({})
  const {message} = useMessage();
  const {setData} = useContext(MenuContext)
  const {request, error, clearError} = useHttp();

  const getData = useCallback(async()=>{
    const data = await request(`/api/page/get/${name}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data,data?.pages[0]);
    setDataPage(data)
    setDataActivePage(data?.pages[0])
  },[request,name,auth.token])

  const updateMenu = useCallback(async(menu)=>{
    setData(dataPage?.name,{
      dopmenu: menu
    })
  },[setData, dataPage?.name])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getData()
  },[getData])

  useEffect(()=>{
    setData(dataPage?.name)
  },[setData,dataPage])

  return (
    <Page data={dataActivePage} updateMenu={updateMenu}/>
  )
}
