import React,{useState} from 'react'

export const Menu = ({buttons=[]}) =>{
  const [visible, setVisible] = useState(false)

  return(
    <>
    {
      (visible)?
      <div className="backGlass" onClick={()=>setVisible(false)}></div>
      :null
    }
    <div className="menuTogleBtn" onClick={()=>setVisible(!visible)}>
      <i className="fas fa-ellipsis-v"></i>
    </div>
    <div onClick={()=>setVisible(false)} className={`contextmenu ${(visible)?"show":"hide"}`}>
      {
        buttons.map((item, index)=>{
          return(
            <div key={index} className="contextmenuElement" onClick={item.active}>
              <span className="state">{(item.check)?<i className="fas fa-check"></i>:null}</span>
              <span className="content">{item.title}</span>
            </div>
          )
        })
      }
    </div>
    </>
  )
}
