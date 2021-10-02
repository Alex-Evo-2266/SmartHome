import React from 'react'

export const ToolBar = ({buttons=[], visible=false, hide}) =>{

  if(buttons?.length === 0){
    return null
  }

  return(
    <div className={`toolbarConteainer ${(visible)?"show":"hide"}`}>
      <div className="toolbar">
        <button onClick={hide} className="backBtn">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="toolbarButtons">
        {
          buttons.map((item, index)=>{
            return(
              <div className="toolbarButton" onClick={item.active}>
                <i className={item.iconClass}></i>
              </div>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}
