import React,{useState,useEffect,useContext} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useHistory} from 'react-router-dom'

export const AddGanrePage = ({type="ganre"}) => {
  const auth = useContext(AuthContext)
  const {goBack} = useHistory()
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [form,setForm] = useState({
    name:'',
    discription:'',
    url:'',
  })

  const out = async()=>{
    var data = new FormData();
    for (var key in form) {
      data.append(key,form[key])
    }

    await request(`/api/files/${type}/add`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
    goBack()
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
      <p>Название</p>
      <input value={form.name} type="text" name="name" onChange={changeHeandler}/>
      <p>описание</p>
      <textarea value={form.discription} name="discription" id="" cols="30" rows="10" onChange={changeHeandler}></textarea>
      <p>ссылка на сайт</p>
      <input value={form.url} onChange={changeHeandler} type="url" name="url"/>
      <button onClick={out}>Отправить</button>
    </div>
  )
}
