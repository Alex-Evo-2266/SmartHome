import React,{useState,useCallback,useEffect,useContext} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {useHttp} from '../../../hooks/http.hook'
import {ImageInput} from '../../moduls/imageInput'

export const ImgOption = () =>{
  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp();
  const [userconf , setUserconf] = useState({
    base:'',
    sunrise:'',
    day:'',
    twilight:'',
    night:''
  });

  const updataConf = useCallback(async()=>{
    const data = await request(`/api/user/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(!data)return;
    let fon = {}
    for (var item of data.images) {
      fon = {...fon,[item.title]:item.image}
    }
    setUserconf({...userconf,...fon})
  },[request,auth.token])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  return(
    <div className="configElement img">
      <h3>Background</h3>
      <ImageInput id="1" title="Base" name = "base" src = {userconf.base}/>
      <ImageInput id="2" title="Sunrise" name="sunrise" src = {userconf.sunrise}/>
      <ImageInput id="3" title="Day" name="day" src = {userconf.day}/>
      <ImageInput id="4" title="Twilight" name="twilight" src = {userconf.twilight}/>
      <ImageInput id="5" title="Night" name="night" src = {userconf.night}/>
    </div>
)
}
