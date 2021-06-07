import React,{useContext,useEffect,useState,useCallback} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {useMessage} from '../../../hooks/message.hook'

export const ActScript = ({idDevice,updata,index,data,el,deleteEl})=>{
  const {message} = useMessage();
  const {loading,request, error, clearError} = useHttp();
  const [sdata,setData] = useState("")
  const auth = useContext(AuthContext)

  const getName = useCallback(async ()=>{
    const data = await request(`/api/script/${idDevice}`, 'Get', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    setData(data)
  },[request,auth.token,idDevice])

  useEffect(()=>{
    getName()
  },[getName])


  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        script: {sdata.name}
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
