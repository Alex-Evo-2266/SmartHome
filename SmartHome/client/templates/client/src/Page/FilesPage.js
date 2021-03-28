import React,{useState} from 'react'
import {NavLink} from 'react-router-dom'

export const FilesPage = () => {
  const [visible,setVisible] = useState(false)

  return(
    <div className = "conteiner">
      <div className={`sidebar ${(visible)?"active":""}`}>
        <div className="toggle-sidebar" onClick={()=>setVisible(prev=>!prev)}><i className="fas fa-bars"></i></div>
        <ul>
          <li><NavLink to="/files/movies">фильмы</NavLink></li>
          <li><NavLink to="/files/serials">сериалы</NavLink></li>
          <li><NavLink to="/files/music">музыка</NavLink></li>
          <li><NavLink to="/files/other">другое</NavLink></li>
        </ul>
      </div>
    </div>
  )
}
