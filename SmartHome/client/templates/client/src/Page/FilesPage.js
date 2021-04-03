import React,{useState} from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import {GalleryPage} from './filespage/GalleryPage'
import {MoviesPage} from './filespage/MoviesPage'

export const FilesPage = () => {
  const [visible,setVisible] = useState(false)
  const location = useLocation();

  return(
    <div className = "conteiner opasityFon">
      <div className={`sidebar ${(visible)?"active":""}`}>
        <div className="toggle-sidebar" onClick={()=>setVisible(prev=>!prev)}>
          <div className={`arrow-menu ${(visible)?"active":""}`}>
            <i class="fas fa-chevron-left"></i>
          </div>
        </div>
        <ul>
          <li><NavLink to="/files/movies">фильмы</NavLink></li>
          <li><NavLink to="/files/serials">сериалы</NavLink></li>
          <li><NavLink to="/files/music">музыка</NavLink></li>
          <li><NavLink to="/files/gallery">галерея сервера</NavLink></li>
          <li><NavLink to="/files/other">другое</NavLink></li>
        </ul>
      </div>
      <div onClick={()=>setVisible(false)}>
      {
        (location.pathname==="/files/gallery")?
        <GalleryPage/>:
        (location.pathname==="/files/movies")?
        <MoviesPage/>:
        null
      }
      </div>
    </div>
  )
}
