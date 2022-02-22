import React,{useEffect,useState,useCallback} from 'react'
import {PageContext} from './pageContext'
import {useHttp} from '../../hooks/http.hook'

export const PageState = ({children, token}) =>{
  const {request, error, clearError} = useHttp();
  const [pages, setPages] = useState({})

  const getPages = useCallback(async()=>{
    const allpages = await request(`/api/page/all`, 'GET', null,{Authorization: `Bearer ${token}`})
    console.log(allpages);
    setPages(allpages)
  },[request, token])

  useEffect(()=>{
    getPages()
  },[getPages])

  useEffect(()=>{
    if(error)
      console.error(error);
    return ()=>{
      clearError();
    }
  },[error, clearError])

  return(
    <PageContext.Provider value={{pages, getPages}}>
      {children}
    </PageContext.Provider>
  )
}
