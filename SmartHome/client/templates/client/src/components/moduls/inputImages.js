import React, {useEffect,useContext,useRef,useState} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const ImagesInput = ({update}) =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const inputRef = useRef(null)
  const imgConteiner = useRef(null)
  const [filesArr,setFiles] = useState([])

  // async function handleFiles(event) {
  //   const files = event.target.files
  //   window.URL = window.URL || window.webkitURL;
  //   var fileList = document.getElementById(`fileList${id}`);
  //
  // if (!files.length) {
  //   fileList.innerHTML = "<p>No files selected!</p>";
  //   return;
  // }
  //
  // var img = document.getElementById(`sammerDayImg${id}`);
  // img.src = window.URL.createObjectURL(files[0]);
  // img.onload = function() {
  //   window.URL.revokeObjectURL(this.src);
  // }
  //   let file = event.target.files[0]
    // var data = new FormData();
    // data.append("image",file)
    // data.append('name',event.target.name)
    // // data.append('name',"image")
    // await request(`/api/media/set/background/${event.target.name}`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
  //
  //   if(onChange){
  //     onChange(event)
  //   }
  //
  //   window.location.reload();
  // }

  const byteToSize = (bytes)=>{
    const size = ["Bytes","KB","MB","GB","TB"]
    if(!bytes) return "0 Bytes"
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024,i),2) + " " + size[i]
  }

  async function handleFiles(event){
    let files = Array.from(event.target.files)
    setFiles(files)
    let conteiner = imgConteiner.current
    conteiner.innerHTML=""
    files.forEach(file => {
      if(!file.type.match('image')){
        return
      }
      const reader = new FileReader()

      reader.onload = ev =>{
        conteiner.insertAdjacentHTML("afterbegin",`
        <div class="image-preview">
          <img src="${ev.target.result}" alt="${file.name}"/>
          <div class="preview-remove" data-name="${file.name}">&times</div>
          <div class="preview-info"><span>${file.name}</span><span>${byteToSize(file.size)}</span></div>
        </div>
        `)
      }

      reader.readAsDataURL(file)
    });
  }

  const imgClick = (event)=>{
    if(!event.target.dataset.name){
      return
    }

    const {name} = event.target.dataset
    let files = filesArr.filter(file=>file.name!=name)
    setFiles(files)
    const block = imgConteiner.current.querySelector(`[data-name="${name}"]`).closest(".image-preview")
    block.classList.add("removeing")
    setTimeout(function () {
      block.remove()
    }, 300);

  }

  const sendFile = async()=>{
    for (const file of filesArr) {
      var data = new FormData();
      data.append("image",file)
      data.append('name',file.name)
      const ret = await request(`/api/media/set/image/${file.name}`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
      if(ret.message==="ok"){
        const block = imgConteiner.current.querySelector(`[data-name="${file.name}"]`).closest(".image-preview")
        block.classList.add("removeing")
        setTimeout(function () {
          block.remove()
        }, 300);
      }
    }
    setFiles([])
    if(typeof(update)==="function"){
      update()
    }
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])


  return(
    <div className="cartImageInput">
      <h2>Загрузить изображение</h2>
      <button className="btn" onClick={()=>inputRef.current.click()}>открыть</button>
      {
        (filesArr&&filesArr[0])?
        <button className="btn primary" onClick={sendFile}>загрузить</button>:
        null
      }
      <input ref={inputRef} multiple={true} type="file" id="fileElem" accept="image/*" onChange={handleFiles}/>
      <div ref={imgConteiner} className="fileList" onClick={imgClick}></div>
    </div>
  )
}
