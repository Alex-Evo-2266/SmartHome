import React, {useState} from 'react'

export const ContextMenuElement = ({item, hide}) =>{
  const [visible, setVisible] = useState(false)

  const buttonClick = (e)=>{
    if(item.sub)
      setVisible(!visible)
    else
      hide()
    if(typeof(item.onClick) === "function")
      item.onClick(e)
  }

  return(
    <div className="contextmenuElement" onClick={buttonClick}>
      {
        (item.icon)?
        <span className="icon">
          <i className={item.icon}></i>
        </span>
        :null
      }
      <span className="content">{item.title}</span>
      <span className={`state ${(visible)?"show":""}`}>
      {
        (item.active)?
        <i className="fas fa-check"></i>:
        (item.sub)?
        <i className="fas fa-chevron-left"></i>
        :null
      }
      </span>
    {
      (visible && item.sub)?
      <div className="contextmenu sub">
      {
        item.sub?.map((item2,index)=>{
          return (
            <div key={index} className="contextmenuElement" onClick={item2.onClick}>
              {
                (item2.icon)?
                <span className="icon">
                  <i className={item2.icon}></i>
                </span>
                :null
              }
              <span className="content">{item2.title}</span>
              <span className="state">{(item2.active)?<i className="fas fa-check"></i>:null}</span>
            </div>
          )
        })
      }
      </div>
      :null
    }
    </div>
  )
}
