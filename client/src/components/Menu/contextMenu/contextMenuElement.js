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
    <>
    <div className="contextmenuElement" onClick={buttonClick}>
      <span className="state">
      {
        (item.active)?
        <i className="fas fa-check"></i>:
        (item.sub)?
        <i className="fas fa-chevron-left"></i>
        :null
      }
      </span>
      <span className="content">{item.title}</span>
    </div>
    {
      (visible && item.sub)?
      <div className="contextSubMenu">
      {
        item.sub?.map((item2,index)=>{
          return (
            <div key={index} className="contextmenuElement" onClick={item2.onClick}>
              <span className="state">{(item2.active)?<i className="fas fa-check"></i>:null}</span>
              <span className="content">{item2.title}</span>
            </div>
          )
        })
      }
      </div>
      :null
    }
    </>
  )
}
