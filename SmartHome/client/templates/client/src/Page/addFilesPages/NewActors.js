import React,{useState,useRef,useEffect,useContext} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useHistory} from 'react-router-dom'

export const AddActorPage = () => {
  const auth = useContext(AuthContext)
  const {goBack} = useHistory()
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const imgPoster = useRef(null)
  const divPoster = useRef(null)
  const poster = useRef()
  const [form,setForm] = useState({
    name:'',
    date_of_birth:'',
    discription:'',
    url:'',
  })

  const out = async()=>{
    let file = poster.current
    var data = new FormData();
    data.append("image",file)
    for (var key in form) {
      data.append(key,form[key])
    }

    await request(`/api/files/actor/add`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
    goBack()
  }


  function handleFiles(event) {
    const files = event.target.files
    window.URL = window.URL || window.webkitURL;
    var fileList = divPoster.current
    poster.current = event.target.files[0]

  if (!files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
    return;
  }

  var img = imgPoster.current
  img.src = window.URL.createObjectURL(files[0]);
  img.onload = function() {
    window.URL.revokeObjectURL(this.src);
  }
}

const changeHeandler = (event)=>{
  setForm({...form,[event.target.name]:event.target.value})
}

useEffect(()=>{
  console.log(form);
},[form])

useEffect(()=>{
  message(error, 'error');
  clearError();
},[error, message, clearError])

  return(
    <div className = "whiteBacground no-pg-top opacity newMovie">
      <p>Имя</p>
      <input value={form.name} type="text" name="name" onChange={changeHeandler}/>
      <p>дата рождения</p>
      <input value={form.date_of_birth} type="date" name="date_of_birth" onChange={changeHeandler}/>
      <p>описание</p>
      <textarea value={form.discription} name="discription" id="" cols="30" rows="10" onChange={changeHeandler}></textarea>
      <div className="imageInput">
        <label>
          <p>Image</p>
          <input type="file" name="poster" id="fileElem" accept="image/*" onChange={handleFiles}/>
          <div ref={divPoster} className="fileList">
            <img ref={imgPoster} className="inputImg" alt="photoActors"/>
          </div>
        </label>
      </div>
      <p>ссылка на сайт</p>
      <input value={form.url} onChange={changeHeandler} type="url" name="url"/>
      <button onClick={out}>Отправить</button>
    </div>
  )
}
