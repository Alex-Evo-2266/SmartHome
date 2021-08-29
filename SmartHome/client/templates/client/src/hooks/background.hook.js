import {useCallback} from 'react';
import defFon from '../img/fon-base.jpg'

function LightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
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

function setColors(data) {
  document.body.style.setProperty('--color-darken',data.c1)
  document.body.style.setProperty('--color-normal',data.c2)
  document.body.style.setProperty('--color-glass',"#aaa9")
  document.body.style.setProperty('--color-light',data.c3)
  document.body.style.setProperty('--text-color-darken-fon',"#fff")
  document.body.style.setProperty('--text-color-light-fon',"#000")
  document.body.style.setProperty('--btn-color-darken',LightenDarkenColor(data.c1,20))
  document.body.style.setProperty('--btn-color-normal',LightenDarkenColor(data.c2,20))
  document.body.style.setProperty('--btn-color-light',LightenDarkenColor(data.c3,20))
}

export const useBackground = () => {

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
      background = {...background,[item.type]:item.image}
    }
  if(data.auteStyle){
    if(backgroundType()==="night"){
      document.body.className = 'night'
    }
    else{
      document.body.className = data.style
    }
  }
  else{
    document.body.className = data.style
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

  const updataBackground = useCallback(async(token,userconfig)=>{
    if(!token){
      console.error("no Autorization");
      defbacground()
      return ;
    }
    const data = userconfig
    let config = {
      style:"light",
      auteStyle:false,
      staticBackground:false,
      images:defFon,
      colors:{
        c1:"#333",
        c2:"#555",
        c3:"#777"
      }
    }
    if(data){
      config = {
        style:data.Style||"light",
        auteStyle:data.auteStyle||false,
        staticBackground: data.staticBackground||false,
        images:data.images,
        colors:data.StyleColor
      }
    }
    else{
      defbacground()
    }
    fonUpdata(config);
    setInterval(()=>{
      fonUpdata(config);
    }, 1000*60*30);
  },[fonUpdata])

  return {updataBackground}
}
