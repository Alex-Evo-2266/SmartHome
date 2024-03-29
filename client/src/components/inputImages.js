import React, {useEffect,useContext,useRef,useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'

export const ImagesInput = ({update}) =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const inputRef = useRef(null)
  const imgConteiner = useRef(null)
  const [filesArr,setFiles] = useState([])

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
    let files = filesArr.filter(file=>file.name!==name)
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
      data.append("file",file)
      data.append('name',file.name)
      const ret = await request(`/api/file/background/load`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
      if(ret==="ok"){
        const block = imgConteiner.current.querySelector(`[data-name="${file.name}"]`).closest(".image-preview")
        block.classList.add("removeing")
        setTimeout(function () {
          block.remove()
        }, 300);
      }
    }
    setFiles([])
    if(typeof(update)==="function"){
      setTimeout(function () {
        update()
      }, 200);
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
      <input ref={inputRef} multiple={true} type="file" id="fileElem" accept="image/*" onChange={handleFiles}/>
      <div ref={imgConteiner} className="fileList" onClick={imgClick}></div>
      <div className="btnConteiner">
      {
        (filesArr&&filesArr[0])?
        <button className="highSelection button" onClick={sendFile}>загрузить</button>:
        null
      }
      <button style={{marginLeft: "10px"}} className="normalSelection button" onClick={()=>inputRef.current.click()}>открыть</button>
      </div>
    </div>
  )
}
