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
  document.body.style.background = `url(${defFon})`;
}

const defstyle = ()=>{
  setColors({
    c1:"#333",
    c2:"#555",
    c3:"#777"
  })
}

const getimage = (images, name)=>{
  try {
    for (var item of images) {
      if(name === item.type)
        return item
    }
  } catch{
    return
  }
}

function setColors(data) {
  document.body.style.setProperty('--color-darken',data.c1)
  document.body.style.setProperty('--color-normal',data.c2)
  document.body.style.setProperty('--color-glass',"#aaa9")
  document.body.style.setProperty('--color-light',data.c3)
  document.body.style.setProperty('--text-color-darken-fon',"#fff")
  document.body.style.setProperty('--text-color-light-fon',"#000")
  document.body.style.setProperty('--btn-color-darken',LightenDarkenColor(data.c1,25))
  document.body.style.setProperty('--btn-color-normal',LightenDarkenColor(data.c2,25))
  document.body.style.setProperty('--btn-color-light',LightenDarkenColor(data.c3,25))
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

export const useCastomStyle = () => {

  const setStyle = (colors)=>{
    if(!colors)
      return defstyle()
    if(!colors.c1)
      colors.c1 = "#333";
    if(!colors.c2)
      colors.c2 = "#555";
    if(!colors.c3)
      colors.c3 = "#777";
    setColors(colors)
  }

  const setBackground = (url)=>{
    if(!url)
      return defbacground()
    document.body.style = `background: url(${url});
      background-size: cover;
      background-attachment: fixed;`;
  }

  const adaptiveBackground = (images)=>{
    if(!images)
      return defbacground()
    console.log(backgroundType());
    setBackground(getimage(images,backgroundType()).image)
  }

  const avtoNightStyle = (style,nightStyle)=>{
    if(!style || !nightStyle)
      return defstyle()
    if(backgroundType() === "night")
      setStyle(nightStyle)
    else
      setStyle(style)
  }

  return {setStyle, setBackground, adaptiveBackground, avtoNightStyle}
}
