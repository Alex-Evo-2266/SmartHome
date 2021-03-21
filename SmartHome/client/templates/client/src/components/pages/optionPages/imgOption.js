import React,{useState,useCallback,useEffect,useContext} from 'react'
import {UserContext} from '../../../context/UserContext'
import {ImageInput} from '../../moduls/imageInput'

export const ImgOption = () =>{
  const config = useContext(UserContext)

  const [userconf , setUserconf] = useState({
    base:'',
    sunrise:'',
    day:'',
    twilight:'',
    night:''
  });

  const updataConf = useCallback(async()=>{
    if(!config||!config.images)return;
    let fon = {}
    for (var item of config.images) {
      fon = {...fon,[item.title]:item.image}
    }
    setUserconf(prev=>{return{...prev,...fon}})
  },[config])

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
