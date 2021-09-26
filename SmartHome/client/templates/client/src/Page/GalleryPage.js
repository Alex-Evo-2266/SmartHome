import React,{useState,useContext,useEffect,useCallback} from 'react'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {ImagesInput} from '../components/moduls/inputImages'
import {AlertContext} from '../components/alert/alertContext'
import {MenuContext} from '../components/Menu/menuContext'
import {ImageDitail} from '../components/files/imageDitail'

export const GalleryPage = () => {
  const auth = useContext(AuthContext)
  const {setData} = useContext(MenuContext)
  const {show,hide} = useContext(AlertContext);
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [visible,setVisible] = useState(false)
  const [end,setEnd] = useState(false)
  const [urls,setUrls] = useState([])
  const [addVisible,setaddVisible] = useState(false)
  const [newUrl,setnewUrl] = useState(0)
  const [ditailElement,setDitailElement] = useState({})

  const getTenUrl = useCallback(async(oldUrl = 0)=>{
    try {
      const data = await request(`/api/image/fon/ten/${oldUrl}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
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
  },[auth.token,newUrl,urls,request])

  const deleteImg = (id)=>{
    show("удалить изображение?","dialog",()=>{
      request(`/api/image/fon/${id}`, 'DELETE', null,{Authorization: `Bearer ${auth.token}`})
      let arr = urls.slice()
      arr = arr.filter(item=>item.id!==id)
      setUrls(arr)
    },hide)
  }

  const ditail = (event,item)=>{
    if(event.target.dataset.type==="rootimg"){
      setDitailElement(item)
      setVisible(true)
    }
  }

  useEffect(()=>{
    if(newUrl===0)
      getTenUrl()
  },[getTenUrl,newUrl])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(addVisible){
      setData("Gallery",{
        specialAction:{
          type: "close",
          action:()=>setaddVisible(false)
        }
      })
    }
    else {
      setData("Gallery",{
        specialAction:{
          type: "add",
          action:()=>setaddVisible(true)
        }
      })
    }
  },[setData,addVisible])

  return(
    <div className="conteiner">
    {
      (visible)?
      <ImageDitail data={ditailElement} hide={()=>setVisible(false)}/>:
      null
    }
    <div className="">
    {
      (addVisible)?
      <ImagesInput update={getTenUrl}/>
      :null
    }
      <div className="galeryContent">
      {
        (urls&&urls[0])?
        urls.map((item,index)=>{
          return(
            <div key={index} className="imageBx" onClick={(event)=>ditail(event,item)}>
              <img src={item.image} alt={item.title} data-type="rootimg"/>
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
        <button className="btn2" onClick={()=>getTenUrl(newUrl)}>ещё</button>:
        null
      }
      </div>
    </div>
    </div>
  )
}
