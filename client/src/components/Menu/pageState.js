import React,{useEffect,useState,useCallback,useContext} from 'react'
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

  return(
    <PageContext.Provider value={{pages, getPages}}>
      {children}
    </PageContext.Provider>
  )
}
