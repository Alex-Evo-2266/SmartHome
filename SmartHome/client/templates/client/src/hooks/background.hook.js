import {useCallback,useEffect} from 'react';
import {useHttp} from './http.hook'
import defFon from '../img/fon-base.jpg'

export const useBackground = () => {
  const {request, error, clearError} = useHttp();

  const backgroundType = function () {
    let time = new Date().getHours();
    let date = new Date().getMonth();
    let nightTime = (date<3||date>8)?17:20;
    let twilightTime = (date<3||date>8)?15:18;
    let sunriseTime = (date<3||date>8)?5:3;
    let dayTime = (date<3||date>8)?10:7;
    if(time>=sunriseTime&&time<dayTime){
      return "sunrise";
    }else if (time>=dayTime&&time<twilightTime) {
      return "day";
    }else if (time>=twilightTime&&time<nightTime) {
      return "twilight";
    }else if ((time>=0&&time<sunriseTime)||time>=nightTime) {
      return "night";
    }
    return "sunrise";
  }

  const fonUpdata = useCallback((data)=>{
  if(data.auteStyle){
    if(backgroundType()==="night"){
      document.body.classList.add('night')
    }
    else{
      document.body.classList.add(data.style)
    }
  }
  else{
    document.body.classList.add(data.style)
  }
  if(data.staticBackground){
    document.body.style = `background: url(/media/fon/fon-base.jpg);
      background-size: cover;
      background-attachment: fixed;`;
    return
  }
  document.body.style = `background: url(/media/fon/fon-${backgroundType()}.jpg);
    background-size: cover;
    background-attachment: fixed;`;
},[])

  const updataBackground = useCallback(async(token)=>{
    if(!token){
      console.error("no Autorization");
      document.body.style = `background: url(${defFon});
        background-size: cover;
        background-attachment: fixed;`;
      return ;
    }
    const data = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${token}`})
    let config = {
      style:"light",
      auteStyle:false,
      staticBackground:false
    }
    if(data&&data.user){
      config = {
        style:data.user.Style||"light",
        auteStyle:data.server.auteStyle||false,
        staticBackground: data.server.staticBackground||false
      }
    }
    else{
      document.body.style = `background: url(${defFon});
        background-size: cover;
        background-attachment: fixed;`;
    }
    fonUpdata(config);
    setInterval(()=>{
      fonUpdata(config);
    }, 1000*60*30);
  },[request,fonUpdata])

  useEffect(()=>{
    if(error)
    console.error(error,"error")
    return ()=>{
      clearError();
    }
  },[error, clearError])

  return {updataBackground}
}
