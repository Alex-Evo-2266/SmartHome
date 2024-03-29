import React,{useState,useContext,useEffect,useCallback} from 'react'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {ImagesInput} from '../components/inputImages'
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
  const [newUrl,setnewUrl] = useState(0)
  const [ditailElement,setDitailElement] = useState({})

  const getTenUrl = useCallback(async(oldUrl = 0)=>{
    try {
      const data = await request(`/api/file/background/get?index=${oldUrl}&count=10`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        if(data.length !== 10)
          setEnd(true)
        setnewUrl(oldUrl+30)
        let arr = urls.slice()
        if(newUrl>oldUrl){
          arr = []
        }
        for (let item of data) {
          arr.push(item)
        }
        setUrls(arr)
      }
    } catch (e) {
      console.error(e);
    }
  },[auth.token,newUrl,urls,request])

  const deleteImg = (id)=>{
    show("удалить изображение?","general",()=>{
      request(`/api/file/background/delete/${id}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      let arr = urls.slice()
      arr = arr.filter(item=>item.title!==id)
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
    setData("Gallery")
  },[setData])

  return(
    <div className="conteiner top bottom">
    {
      (visible)?
      <ImageDitail data={ditailElement} hide={()=>setVisible(false)}/>:
      null
    }
    <div className="">
      <ImagesInput update={getTenUrl}/>
      <div className="galeryContent">
      {
        (urls&&urls[0])?
        urls.map((item,index)=>{
          return(
            <div key={index} className="imageBx" onClick={(event)=>ditail(event,item)}>
              <img src={item.image} alt={item.title} data-type="rootimg"/>
              <div className="preview-remove" onClick={()=>deleteImg(item.title)}>
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
