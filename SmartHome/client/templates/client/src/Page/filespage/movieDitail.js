import React,{useEffect,useState,useContext,useCallback} from 'react'
import {useParams,Link} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const MovieDitail = ({type="movie"})=>{
  const auth = useContext(AuthContext)
  const {id} = useParams();
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [movie, setMovie] = useState({})

  const edit = ()=>{

  }

  const getData = useCallback(async()=>{
    const data = await request(`/api/files/movie/${id}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    if(data){
      setMovie(data.movie)
    }
  },[])

  useEffect(()=>{
    getData()
  },[getData])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return (
    <>
    <div className="z-0 backForm "></div>
    <div className="conteiner movie-ditail">
      <div className="base">
      <div className="div-poster">
        <img src={movie.poster} alt="poster"/>
      </div>
      <div className="div-vertical-separator"></div>
      <div className="div-movie-info">
        <div className="discription">
          <h2>{movie.title}</h2>
          <p>{movie.discription}</p>
        </div>
        <div className="control">
          <button className="btn">открыть</button>
          <Link className="btn" to={`/${type}/edit/${id}`}>Изменить</Link>
        </div>
        <div className="about-the-film">
          <div className="paragraph">
            <div className="name">год производства</div>
            <div className="value">{movie.year}</div>
          </div>
          <div className="paragraph">
            <div className="name">страна</div>
            <div className="value">{movie.country}</div>
          </div>
          <div className="paragraph">
            <div className="name">жанр</div>
            <div className="value">{
              (movie&&movie.genres)?
              movie.genres.map((item,index,arr)=>{
                return (
                  <div className="d-in" key={index}>
                    <a href="#">{item.name}</a>
                    {(arr.length-1!==index)?<span>, </span>:null}
                  </div>
                )
              }):null
            }</div>
          </div>
          <div className="paragraph">
            <div className="name">слоган</div>
            <div className="value">{movie.tagline}</div>
          </div>
          <div className="paragraph">
            <div className="name">режисеры</div>
            <div className="value flex">{
              (movie&&movie.directors)?
              movie.directors.map((item,index)=>{
                return (
                  <div className="director-or-actor-card" key={index}>
                    <div className="photo-img">
                      <img src={item.image} alt={item.name}/>
                    </div>
                    <p>{item.name}</p>
                  </div>
                )
              })
              :null
            }</div>
          </div>
          <div className="paragraph">
            <div className="name">бютжет</div>
            <div className="value">{movie.budget}$</div>
          </div>
          <div className="paragraph">
            <div className="name">сборы в США</div>
            <div className="value">{movie.fees_in_usa}$</div>
          </div>
          <div className="paragraph">
            <div className="name">сборы в мире</div>
            <div className="value">{movie.fees_in_world}$</div>
          </div>
          <div className="paragraph">
            <div className="name">премьера в мире</div>
            <div className="value">{movie.world_premiere}</div>
          </div>
        </div>
      </div>
      </div>
      <div className="actors">
        <h3>Актеры</h3>
        <div className="flex slider">{
          (movie&&movie.actors)?
          movie.actors.map((item,index)=>{
            return (
              <div className="director-or-actor-card" key={index}>
                <div className="photo-img">
                  <img src={item.image} alt={item.name}/>
                </div>
                <p>{item.name}</p>
              </div>
            )
          })
          :null
        }</div>
      </div>
    </div>
    </>
  )
}
