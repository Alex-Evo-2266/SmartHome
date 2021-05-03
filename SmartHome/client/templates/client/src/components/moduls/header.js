import React,{useState} from 'react'
import {NavLink} from 'react-router-dom'

export const Header = ({search,name,children})=>{
  const [searcht, setSearch] = useState('');
  const [searchtVisible, setSearchVisible] = useState(false);

  const searchHandler = event => {
    setSearch(event.target.value)
  }

  const keyd = (e)=>{
    if(e.keyCode===13&&typeof(search)==="function"){
      search(searcht)
    }
  }

  return(
    <header>
      {
        (search)?
        <>
        <div className={`btn ${(searchtVisible)?"active":""}`} onClick={()=>setSearchVisible(prev=>!prev)}>
          <i className="fas fa-search"></i>
        </div>
        <div className={`search ${(searchtVisible)?"show":"hide"}`}>
          <input type="search" name="search" onChange={searchHandler} onKeyDown={keyd} value={searcht}/>
          <button onClick={()=>search(searcht)} className="searchBtn">Search</button>
        </div>
        </>:null
      }
      <div className="controls">
      {children}
      </div>
      <h1>{name}</h1>
    </header>
  )
}
