import React,{useState} from 'react'

export const ModalWindow = ({
  position = "fixed",
  zindex=5,
  children,
  top=240,
  left=300,
  hide = null,
  userBtn = null,
  width = "auto",
  height = "auto",
  title="window",
  moving = true,
  heightToolbar = 30,
  className = "",
  style = {},
  styleContent = {},
})=>{
  const [point, setPoint] = useState({
    top:top,
    left:left
  })
// .getBoundingClientRect()
  const mouseDown = (event)=>{
    if(event.target.className!=="modalHeader")
      return;
    let parent = event.target.parentNode.parentNode.getBoundingClientRect()
    var coords = getCoords(event.target);
    var shiftX = event.pageX - coords.left + parent.x;
    var shiftY = event.pageY - coords.top + parent.y;
    moveAt(event)

    function moveAt(e) {
      if(e.pageX < 65||e.pageX > document.body.clientWidth||e.pageY < 5||e.pageY > document.clientHeight){
        return
      }
      setPoint({
        left:e.pageX - shiftX,
        top:e.pageY - shiftY
      })

    }

    document.onmousemove = function(e) {
      moveAt(e);
    };

    document.onkeydown = function (e) {
      if(e.key==="Escape"){
        document.onmousemove = null;
        event.onmouseup = null;
        document.onkeydown = null;

      }
    }

    event.target.onmouseup = function() {
      document.onmousemove = null;
      event.onmouseup = null;
      document.onkeydown = null;

    };


    function getCoords(elem) {   // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  }
  }

  return(
    <div className={`modalWindow ${className}`} style={{top:`${point.top}px`,left:`${point.left}px`,zIndex:zindex,position:position,...style}}>
      <div className="modalHeader" style={{height: `${heightToolbar}px`}} onMouseDown={(moving)?mouseDown:null} onDragStart={()=>false}>
        <h4>{title}</h4>
        {(userBtn)?<button className = "userBtn" onClick = {userBtn}><i className="fas fa-list"></i></button>:null}
        {(hide)?<button className = "hide" onClick = {hide}>&times;</button>:null}
      </div>
      <div className="modalContent" style={{width:(width!=="auto")?`${width}px`:"",height:(height!=="auto")?`${height}px`:"",...styleContent}}>
        {children}
      </div>
    </div>
  )
}
