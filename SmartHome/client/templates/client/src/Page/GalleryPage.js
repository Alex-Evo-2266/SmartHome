import React,{useState,useContext,useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {ImagesInput} from '../components/moduls/inputImages'
import {AlertContext} from '../components/alert/alertContext'

export const GalleryPage = () => {
  const auth = useContext(AuthContext)
  const {show,hide} = useContext(AlertContext);
  const {message} = useMessage();
  const {loading,request, error, clearError} = useHttp();
  const [visible,setVisible] = useState(false)
  const [end,setEnd] = useState(false)
  const [urls,setUrls] = useState([])
  const [newUrl,setnewUrl] = useState(0)

  const getTenUrl = async(oldUrl = 0)=>{
    try {
      console.log("wtf");
      const data = await request(`/api/image/fon/${oldUrl}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      if(data&&data.images){
        setEnd(data.end)
        setnewUrl(oldUrl+10)
        let arr = urls.slice()
        if(newUrl>oldUrl){
          arr = []
        }
        for (let item of data.images) {
          arr.push(item)
        }
        setUrls(arr)
      }
    } catch (e) {
      console.error(e);
    }
  }

  const deleteImg = (id)=>{
    show("удалить изображение?","dialog",()=>{
      request(`/api/image/fon/delete`, 'POST', {id},{Authorization: `Bearer ${auth.token}`})
      let arr = urls.slice()
      arr = arr.filter(item=>item.id!=id)
      setUrls(arr)
    },hide)
  }

  useEffect(()=>{
    getTenUrl()
  },[])

  useEffect(()=>{
    console.log(urls);
  },[urls])

  return(
    <div className = "conteiner opasityFon">
      <ImagesInput update={getTenUrl}/>
      <div className="galeryContent">
      {
        (urls&&urls[0])?
        urls.map((item,index)=>{
          return(
            <div key={index} className="imageBx">
              <img src={item.image} alt={item.title}/>
              <div className="preview-remove" onClick={()=>deleteImg(item.id)}>
              <i className="fas fa-times"></i>
              </div>
              <div className="preview-info"><span>{item.title}</span></div>
            </div>
          )
        }):null
      }
      {
        (!end)?
        <button className="btn" onClick={()=>getTenUrl(newUrl)}>ещё</button>:
        null
      }
      </div>
    </div>
  )
}
