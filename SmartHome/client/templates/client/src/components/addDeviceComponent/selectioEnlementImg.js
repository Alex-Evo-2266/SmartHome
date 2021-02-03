import React,{useEffect} from 'react'

export const SelectioEnlementImg = ({width="90px", height="80px", name, title, onClick,src,active = false})=>{

  const anim = ()=>{
    let el = document.getElementById(`p-${name}`)
    let el2 = document.getElementById(`div-${name}`)
    if(el.clientWidth >= el2.clientWidth){
      el.className="scroll"
      el.innerHTML=`| ${title} | ${title}`
    }
    else{
      el.className=""
    }
  }
  useEffect(()=>{
    anim()
  },[name])

  return(
    <div style={{width,height}} title={name} className={`selectioEnlementImg ${(active)?"active":""}`} onClick={onClick}>
      <img alt={`interfese ${name}`} src={src}/>
      <div id={`div-${name}`} className="info">
        <p id={`p-${name}`}>| {title} |</p>
      </div>
    </div>
  )
}
