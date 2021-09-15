import React,{useState} from 'react'

export const Menu = ({buttons=[]}) =>{
  const [visible, setVisible] = useState(false)

  return(
    <>
    <div className="menuTogleBtn" onClick={()=>setVisible(!visible)}>
      <i className="fas fa-ellipsis-v"></i>
    </div>
    <div onClick={()=>setVisible(false)} className={`contextmenu ${(visible)?"show":"hide"}`}>
      {
        buttons.map((item, index)=>{
          return(
            <div key={index} className="contextmenuElement" onClick={item.active}>
            {item.title}
            </div>
          )
        })
      }
    </div>
    </>
  )
}
