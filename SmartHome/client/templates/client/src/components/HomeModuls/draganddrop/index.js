export const draganddrop = (root)=>{
  let elements = root.querySelectorAll("div[data-type='move']")
  let drags = root.querySelectorAll("div[data-el='drag']")
  console.log(drags);
  const down = (e)=>{
    let el = e.target.closest("div[data-type='move']")
    if(e.button === 2){
      el.style.position = 'absolute'
      moveAt(e)
      document.body.appendChild(el);
      el.style.zIndex = 1000;

      for (var item of drags) {
        item.mouseover = function(e) {
          e.target.classList.add("dragOver")
        }
        item.mouseout = function(e) {
          e.target.classList.remove("dragOver")
        }
      }
      document.onmousemove = function(e) {
        moveAt(e);
      }

      el.onmouseup = function() {
        document.onmousemove = null;
        el.onmouseup = null;
        for (var item of drags) {
          item.mouseover = null
          item.mouseout = null
        }
      }
    }

    function moveAt(e) {
      el.style.left = e.pageX - el.offsetWidth / 2 + 'px';
      el.style.top = e.pageY - el.offsetHeight / 2 + 'px';
    }
  }

  const contextmenu = e => e.preventDefault()

  document.body.addEventListener("contextmenu",contextmenu)

  for (var item of elements) {
    item.addEventListener("mousedown",down)
  }
  return{
    delete(){
      console.log("delete");
      document.body.removeEventListener("contextmenu",contextmenu)
      for (var item of elements) {
        item.removeEventListener("mousedown",down)
      }
    },
  }
}
