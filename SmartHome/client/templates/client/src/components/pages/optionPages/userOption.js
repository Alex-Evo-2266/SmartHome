import React,{useContext,useEffect} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {Loader} from '../../Loader'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import lightStyle from '../../../img/lightstyle.png'
import nightStyle from '../../../img/nightstyle.png'
import gibridStyle from '../../../img/gibridstyle.png'

export const UserOption = () =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();

  const styleHandler = async(event)=>{
    await request(`/api/user/config/style/edit`, 'POST', {style:event.target.name},{Authorization: `Bearer ${auth.token}`})
    window.location.reload();
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  if(loading){
    return <Loader/>
  }

  return(
    <div className = "pagecontent">
      <div className="configElement choice">
        <h2>Style</h2>
        <img alt="style night" src={nightStyle} className="choice" name="night" onClick={styleHandler}/>
        <img alt="style gibrid" src={gibridStyle} className="choice" name="gibrid" onClick={styleHandler}/>
        <img alt="style light" src={lightStyle} className="choice" name="light" onClick={styleHandler}/>
      </div>
    </div>
)
}
