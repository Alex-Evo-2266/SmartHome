import React, {useEffect,useState, useRef,useCallback} from 'react'

export const Tabs = ({buttons})=>{
  const [sizeWidth, setSizeWidth] = useState(window.innerWidth)
  const [isscroll, setisScroll] = useState(false)
  const container = useRef(null)

  const contextMenu = (e) =>{
    e.preventDefault()
  }

  useEffect(()=>{
    window.addEventListener("resize",resizeThrottler)
    function resizeThrottler(event) {
      setSizeWidth(event.target.innerWidth)
      console.log("qq");
    }
    return ()=>{
      window.removeEventListener("resize", resizeThrottler);
    }
  },[])

  return(
      <div ref={container} className="tabsConteiner">
        {
          (sizeWidth > 700 && isscroll)?
          <div className="tabsArrow"><i className="fas fa-chevron-left"></i></div>
          :null
        }
        <div className={`tabs ${(isscroll)?"scroll":""}`}>
          {
            buttons?.map((item, index)=>{
              return(
                <div onContextMenu={contextMenu} key={index} className={`tabButton ${(item.active)?"active":""}`} onClick={item.action}>{item.title}</div>
              )
            })
          }
        </div>
        {
          (sizeWidth > 700 && isscroll)?
          <div className="tabsArrow"><i className="fas fa-chevron-right"></i></div>
          :null
        }
      </div>
  )
}
