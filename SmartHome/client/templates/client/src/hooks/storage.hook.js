import {useCallback} from 'react'

export const useStorage = () => {
  const setData = useCallback((storegeName,data)=>{
    localStorage.setItem(storegeName, JSON.stringify(data))
  },[])

  const getData = useCallback((storegeName)=>{
    return JSON.parse(localStorage.getItem(storegeName))
  },[])

  const removeData = useCallback((storegeName)=>{
    localStorage.removeItem(storegeName)
  },[])

  return {setData,getData,removeData}
}
