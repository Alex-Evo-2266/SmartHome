import {useCallback,useEffect} from 'react';
import {useHttp} from './http.hook'
import defFon from '../img/fon-base.jpg'

const defbacground = ()=>{
  document.body.style = `background: url(${defFon});
    background-size: cover;
    background-attachment: fixed;`;
}

export const useBackground = () => {
  const {request, error, clearError} = useHttp();

  const backgroundType = function () {
    let time = new Date().getHours();
    let date = new Date().getMonth();
    let nightTime = (date<3||date>8)?17:20;
    let twilightTime = (date<3||date>8)?15:18;
    let sunriseTime = (date<3||date>8)?5:3;
    let dayTime = (date<3||date>8)?10:8;
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
    let background={}
    for (var item of data.images) {
      background = {...background,[item.title]:item.image}
    }
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
  if(data.staticBackground&&background.base){
    document.body.style = `background: url(${background.base});
      background-size: cover;
      background-attachment: fixed;`;
    return
  }
  else if(background[backgroundType()]){
    document.body.style = `background: url(${background[backgroundType()]});
      background-size: cover;
      background-attachment: fixed;`;
  }
  else{
    defbacground()
  }
},[])

  const updataBackground = useCallback(async(token)=>{
    if(!token){
      console.error("no Autorization");
      defbacground()
      return ;
    }
    const data = await request(`/api/user/config`, 'GET', null,{Authorization: `Bearer ${token}`})
    console.log(data);
    let config = {
      style:"light",
      auteStyle:false,
      staticBackground:false,
      images:defFon
    }
    if(data){
      config = {
        style:data.Style||"light",
        auteStyle:data.auteStyle||false,
        staticBackground: data.staticBackground||false,
        images:data.images
      }
    }
    else{
      defbacground()
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
