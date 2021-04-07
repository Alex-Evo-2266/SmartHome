import React from 'react'

export const MovieCard = ({data,onClick})=>{

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-card-image">
        <img src={data.poster} alt={data.title}/>
      </div>
      <div className="movie-card-content">
        <h2>{data.title}</h2>
      </div>
    </div>
  )
}
