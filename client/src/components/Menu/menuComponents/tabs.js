import React, {useRef} from 'react'

export const Tabs = ({buttons})=>{
  const container = useRef(null)

  const contextMenu = (e) =>{
    e.preventDefault()
  }

  return(
      <div ref={container} className="tabsConteiner">
        <div className={`tabs`}>
          {
            buttons?.map((item, index)=>{
              return(
                <div onContextMenu={contextMenu} key={index} className={`tabButton ${(item.active)?"active":""}`} onClick={item.action}>{item.title}</div>
              )
            })
          }
        </div>
      </div>
  )
}
