import {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defFon from '../img/fon-base.jpg'
import { useHttp } from './http.hook';
import { useMessage } from './message.hook';
import {setStyle as set_style} from '../store/reducers/styleReducer'
function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

const defbacground = ()=>{
  document.body.style = `background: url(${defFon});
    background-size: cover;
    background-attachment: fixed;`;
}

const defstyle = ()=>{
  setColors({
    color1:"#303030",
    color2:"#505050",
    active:"#1E90FF",
    ok:"#00d22d"
  })
}

const getimage = (images, name)=>{
  try {
    for (var item of images) {
      if(name === item.type)
        return item
    }
  } catch(e){
    console.error (e)
    return
  }
}

const geturl = (images, name)=>{
  let image = getimage(images, name)
  if(image?.host)
    return image?.host + image?.url
  return image?.url
}

const textColor = (fon)=>{
  let color = "gray"
  if (fon[0] === "#") {
      fon = fon.slice(1);
  }
  var num = parseInt(fon,16);
  var r = (num >> 16);
  var b = ((num >> 8) & 0x00FF);
  var g = (num & 0x0000FF);
  if ((r < 200||g < 200||b < 200))
  {
    color="#fff";
  }

  return color;
}

function setColors(data) {
  document.body.style.setProperty('--color-base',data.color1)
  document.body.style.setProperty('--color-normal',data.color2)
  document.body.style.setProperty('--color-active',data.active)
  document.body.style.setProperty('--color-error',"red")
  document.body.style.setProperty('--color-ok',"green")


  document.body.style.setProperty('--color-base-light',LightenDarkenColor(data.color1,25))
  document.body.style.setProperty('--color-normal-light',LightenDarkenColor(data.color2,25))
  document.body.style.setProperty('--color-active-light',LightenDarkenColor(data.active,25))

// "#5e6367"
  document.body.style.setProperty('--text-color-base-fon',textColor(data.color1))
  document.body.style.setProperty('--text-color-normal-fon',textColor(data.color2))
  document.body.style.setProperty('--text-color-active-fon',"#fff")


  document.body.style.setProperty('--color-glass-normal',data.color2 + "90")
  document.body.style.setProperty('--color-glass-base',data.color1 + "90")
  document.body.style.setProperty('--color-glass-active',data.active + "90")

  document.body.style.setProperty('--color-glass-normal-dark',data.color2 + "d0")
  document.body.style.setProperty('--color-glass-base-dark',data.color1 + "d0")
  document.body.style.setProperty('--color-glass-active-dark',data.active + "d0")
}

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

export const useStyle = () => {

  const style = useSelector(state => state.style)
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const {request, error, clearError} = useHttp()
  const {message} = useMessage()

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  const loadStyle = useCallback(async()=>{
    try
    {
      let data = await request("/api/users/styles", "GET", null, {Authorization: `Bearer ${auth.token}`})
      if (data && data.light_style && data.night_style && data.special_style && data.backgrounds)
      {
        dispatch(set_style({
          nightStyle: data.night_style, 
          lightStyle: data.light_style, 
          specialStyle: data.special_style, 
          backgrounds: data.backgrounds,
          special_topic: data.special_topic
        }))
      }
    }
    catch
    {}
  },[request, dispatch, auth.token])

  // const 

  const setStyle = useCallback((style)=>{
    if(!style)
      return defstyle()
    if(!style.color1)
      style.color1 = "#333";
    if(!style.color2)
      style.color2 = "#555";
    if(!style.active)
      style.active = "#1E90FF";
    setColors(style)
  },[])

  const setBackground = useCallback((url)=>{
    if(!url)
      return defbacground()
    document.body.style = `background: url(${url});
      background-size: cover;
      background-attachment: fixed;`;
  },[])

  const adaptiveBackground = useCallback(()=>{
    if(!style.backgrounds)
      return defbacground()
    if(style.special_topic)
      return setBackground(geturl(style.backgrounds,"BASE"))
    setBackground(geturl(style.backgrounds,backgroundType()))
  },[setBackground, style])

  const avtoNightStyle = useCallback(()=>{
    if(!style)
      return defstyle()
    if(style.special_topic)
      setStyle(style.specialStyle)
    else if(backgroundType() === "night")
      setStyle(style.nightStyle)
    else
      setStyle(style.lightStyle)
  },[setStyle, style])

  return {loadStyle, setStyle, setBackground, adaptiveBackground, avtoNightStyle}
}
