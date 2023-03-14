import React from 'react'
import { BaseCard } from './baseCard'

export const MiniCard = ({text, img, defImg, className, onClick})=>{

  return(
    <BaseCard className={`min ${className}`} onClick={onClick}>
		<div className='card-img min circle'>
			{
				(img)?
				<img alt="device img" src={img}/>:
				<img alt="device img" src={defImg}/>
			}
		</div>
		<div className='card-content'>
      		<h2>{text}</h2>
    	</div>
	</BaseCard>
  )
}
