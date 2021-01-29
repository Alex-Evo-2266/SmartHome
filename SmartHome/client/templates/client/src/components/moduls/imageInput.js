import React, {useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'

export const ImageInput = ({title, src, name, onChange=null, id}) =>{
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  async function handleFiles(event) {
    const files = event.target.files
    window.URL = window.URL || window.webkitURL;
    var fileList = document.getElementById(`fileList${id}`);

  if (!files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
    return;
  }

  var img = document.getElementById(`sammerDayImg${id}`);
  img.src = window.URL.createObjectURL(files[0]);
  img.onload = function() {
    window.URL.revokeObjectURL(this.src);
  }
    let file = event.target.files[0]
    var data = new FormData();
    data.append(event.target.name,file)
    data.append('name',event.target.name)
    await request(`/api/media/set/${event.target.name}`, 'POST',data,{},true)

    if(onChange){
      onChange(event)
    }

    window.location.reload();
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])


  return(
    <div className="imageInput">
      <label>
        <p>{title}</p>
        <input type="file" name={name} id="fileElem" accept="image/*" onChange={handleFiles}/>
        <div id={`fileList${id}`} className="fileList">
          <img src={src} id={`sammerDayImg${id}`} className="inputImg" alt={name}/>
        </div>
      </label>
    </div>
  )
}
