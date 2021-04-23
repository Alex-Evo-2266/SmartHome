import React,{useState,useRef,useEffect,useCallback,useContext} from 'react'
import {useHistory,useParams} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {useStorage} from '../../hooks/storage.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const AddMoviePage = ({type="movie",edit=false}) => {
  const storegeName = (type==="movie")?"Moviestorage":"Serialstorage"
  const {id} = useParams()
  const def = {
    title:'',
    tagline:'',
    discription:'',
    year:2019,
    country:"",
    regisers:[],
    actors:[],
    ganres:[],
    date:'',
    budget:0,
    fees_in_usa:0,
    fees_in_world:0,
    category:'',
    url:'',
    urlLocal:'',
    loaded:false,
    quality:'',
    count_seasons:0,
    closed:false,
    save_seasons:0,
  }
  const auth = useContext(AuthContext)
  const history = useHistory()
  const {setData,removeData,getData} = useStorage()
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const imgPoster = useRef(null)
  const divPoster = useRef(null)
  const poster = useRef()
  const [actors,setActors] = useState([])
  const [ganres,setGanres] = useState([])
  const [categorys,setCategorys] = useState([])
  const [form,setForm] = useState(def)

  const out = async()=>{
    var data = new FormData();
    removeData(storegeName)
    if(poster.current){
      let file = poster.current
      data.append("poster",file)
    }
    for (var key in form) {
      data.append(key,form[key])
    }
    if(type==="movie"&&!edit)
      await request(`/api/files/movies/add`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
    if(type==="serial"&&!edit)
      await request(`/api/files/serials/add`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
    if(type==="movie"&&edit)
      await request(`/api/files/movies/edit/${id}`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
    if(type==="serial"&&edit)
      await request(`/api/files/serials/edit/${id}`, 'POST',data,{Authorization: `Bearer ${auth.token}`},true)
    history.push(`/files/${type}s`)
  }


  const giveData = useCallback(async()=>{
    const allactors = await request('/api/files/actors/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    const allganres = await request('/api/files/ganres/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    const allcategorys = await request('/api/files/category/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(allactors){
      setActors(allactors.actors)
    }
    if(allganres){
      setGanres(allganres.ganres)
    }
    if(allcategorys){
      setCategorys(allcategorys.category)
    }
    console.log(allactors,allganres,allcategorys);
  },[auth.token,request])

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

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(Number(opt.value)||opt.value);
    }
  }
  return result;
}

const changeSelect = (event)=>{
  setForm({...form,[event.target.name]:getSelectValues(event.target)})
}

const changeHeandler = (event)=>{
  setForm({...form,[event.target.name]:event.target.value})
}

const checkedHeandler = (event)=>{
  setForm({...form,[event.target.name]:event.target.checked})
}

const getMovieData = useCallback(async()=>{
  const data = await request(`/api/files/movie/${id}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
  if(data&&data[type]){
    let item = data[type]
    console.log(item);
    setForm((prev)=>{return{
      ...prev,
      title:item.title,
      tagline:item.tagline,
      discription:item.discription,
      year:item.year,
      country:item.country,
      regisers:item.directors && item.directors.map((item2)=>item2.id),
      actors:item.actors && item.actors.map((item2)=>item2.id),
      ganres:item.genres && item.genres.map((item2)=>item2.id),
      date:item.world_premiere,
      budget:item.budget,
      fees_in_usa:item.fees_in_usa,
      fees_in_world:item.fees_in_world,
      category:item.category.id,
      url:item.url,
      urlLocal:item.localUrl,
      loaded:item.loaded,
      quality:item.grade,
      count_seasons:item.count_seasons||0,
      closed:item.closed||false,
      save_seasons:item.save_seasons||0,
    }})
    var img = imgPoster.current
    img.src = item.poster
  }
},[request,auth.token,id,type])

useEffect(()=>{
  giveData()
},[giveData])

useEffect(()=>{
  if(edit){
    getMovieData()
  }
},[edit,getMovieData])

useEffect(()=>{
  const d = getData(storegeName)
  if(d)
    setForm(d)
},[getData,storegeName])

useEffect(()=>{
  setData(storegeName,form)
},[form,setData,storegeName])

useEffect(()=>{
  message(error, 'error');
  clearError();
},[error, message, clearError])

  return(
    <div className = "whiteBacground no-pg-top opacity newMovie">
      <p>Название фильма</p>
      <input value={form.title} type="text" name="title" onChange={changeHeandler}/>
      <p>Слоган</p>
      <input value={form.tagline} type="text" name="tagline" onChange={changeHeandler}/>
      <p>страна</p>
      <input value={form.country} type="text" name="country" onChange={changeHeandler}/>
      <p>описание</p>
      <textarea value={form.discription} name="discription" id="" cols="30" rows="10" onChange={changeHeandler}></textarea>
      <div className="imageInput">
        <label>
          <p>Poster</p>
          <input type="file" name="poster" id="fileElem" accept="image/*" onChange={handleFiles}/>
          <div ref={divPoster} className="fileList">
            <img ref={imgPoster} className="inputImg" alt="poster"/>
          </div>
        </label>
      </div>
      <p>год выхода</p>
      <input value={form.year} type="number" name="year" onChange={changeHeandler}/>
      <p>режисер</p>
      <div className="selected-div">
        <select value={form.regisers} className="actor-ganre-select" name="regisers" multiple={true} onChange={changeSelect}>
        {
          actors.map((item,index)=>{
            return(
              <option key={index} value={item.id}>{item.name}</option>
            )
          })
        }
        </select>
        <button onClick={()=>history.push("/actor/add")} className="actor-ganre-add-btn"><i className="fas fa-plus"></i></button>
      </div>
      <p>актеры</p>
      <div className="selected-div">
        <select value={form.actors} className="actor-ganre-select" name="actors" multiple={true} onChange={changeSelect}>
        {
          actors.map((item,index)=>{
            return(
              <option key={index} value={item.id}>{item.name}</option>
            )
          })
        }
        </select>
        <button onClick={()=>history.push("/actor/add")} className="actor-ganre-add-btn"><i className="fas fa-plus"></i></button>
      </div>
      <p>жанр</p>
      <div className="selected-div multi">
        <select value={form.ganres} className="actor-ganre-select" name="ganres" multiple={true} onChange={changeSelect}>
        {
          ganres.map((item,index)=>{
            return(
              <option key={index} value={item.id}>{item.name}</option>
            )
          })
        }
        </select>
        <button onClick={()=>history.push("/ganre/add")} className="actor-ganre-add-btn"><i className="fas fa-plus"></i></button>
      </div>
      <p>дата выхода</p>
      <input value={form.date} onChange={changeHeandler} type="date" name="date"/>
      <p>бюджет</p>
      <input value={form.budget} min={0} onChange={changeHeandler} type="number" name="budget"/>
      <p>сборы в США</p>
      <input value={form.fees_in_usa} onChange={changeHeandler} type="number" name="fees_in_usa"/>
      <p>сборы в мире</p>
      <input value={form.fees_in_world} onChange={changeHeandler} type="number" name="fees_in_world"/>
      <p>категория</p>
      <div className="selected-div">
        <select value={form.category} onChange={changeHeandler} name="category">
          <option value={""}></option>
        {
          categorys.map((item,index)=>{
            return(
              <option key={index} value={item.id}>{item.name}</option>
            )
          })
        }
        </select>
        <button onClick={()=>history.push("/category/add")} className="actor-ganre-add-btn"><i className="fas fa-plus"></i></button>
      </div>
      {
        (type==="serial")?
        <>
        <p>количество сезонов</p>
        <input value={form.count_seasons} min={0} onChange={changeHeandler} type="number" name="count_seasons"/>
        <p>закрыт</p>
        <input value={form.closed} onChange={checkedHeandler} type="checkbox" name="closed"/>
        <p>количество загруженных сезонов</p>
        <input value={form.save_seasons} min={0} onChange={changeHeandler} type="number" name="save_seasons"/>
        </>
        :null
      }
      <p>ссылка на сайт</p>
      <input value={form.url} onChange={changeHeandler} type="url" name="url"/>
      <p>Скачено</p>
      <input value={form.loaded} onChange={checkedHeandler} type="checkbox" name="loaded"/>
      {
        (form.loaded)?
        <>
        <p>ссылка на скаченный файл</p>
        <input value={form.urlLocal} onChange={changeHeandler} type="text" name="urlLocal"/>
        <p>качество скаченного файла</p>
        <input value={form.quality} onChange={changeHeandler} type="text" name="quality"/>
        </>
        :null
      }
      <button onClick={out}>Отправить</button>
      {
        (!edit)?
        <button onClick={()=>{
          removeData(storegeName)
          setForm(def)
        }}>Очистить</button>
        :null
      }
    </div>
  )
}
