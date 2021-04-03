import React,{useState,useContext,useEffect,useCallback,useRef} from 'react'
import {AuthContext} from '../../context/AuthContext.js'
import {Link} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {MovieCard} from '../../components/files/movieCard'

export const MoviesPage = () => {
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [allmovies,setAllMovies] = useState([])
  const [movies,setMovies] = useState([])
  const [search, setSearch] = useState('');
  const read = useRef(0)

  useEffect(()=>{
    if(read.current<3){
      setMovies(allmovies)
      read.current++
    }
    console.log(allmovies);
  },[allmovies])

  const searchout = ()=>{
    if(search===""){
      setMovies(allmovies)
      return
    }
    let array = allmovies.filter(item => item&&item.title.indexOf(search)!==-1)
    setMovies(array)
  }

  const searchHandler = event => {
    setSearch(event.target.value)
  }

  const keyd = (e)=>{
    if(e.keyCode===13){
      searchout()
    }
  }

  const getMovies = useCallback(async()=>{
    try {
      const data = await request(`/api/files/movies/all`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      console.log(data);
      if(data&&data.movies){
        setAllMovies(data.movies)
      }
    } catch (e) {
      console.error(e);
    }
  },[auth.token,request])

  useEffect(()=>{
    getMovies()
  },[getMovies])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <>
    <header>
      <h1>Movies</h1>
      <Link to="/movie/add" className="titleButtonAdd"><i className="fas fa-plus"></i></Link>
      <input type="search" name="search" id="searchDevices" onChange={searchHandler} onKeyDown={keyd} value={search}/>
      <button onClick={searchout} className="searchBtn">Search</button>
    </header>
    <div className="movies">
      <div className="movies-list">
        {
          movies.map((item,index)=>{
            return(
              <MovieCard data={item} key={index}/>
            )
          })
        }
      </div>
    </div>
    </>
  )
}
