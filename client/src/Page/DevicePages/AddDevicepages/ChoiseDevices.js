import React,{useCallback, useEffect, useState} from 'react'
import defImg from '../../../img/chipflat.png'
import lampImg from '../../../img/lamp.png'
import switchImg from '../../../img/lamp.png'
import variableImg from '../../../img/variable.png'
import { MiniCard } from '../../../components/cards/miniCard'
import { useDispatch } from 'react-redux'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'

const typeImages = {
  "light": lampImg,
  "switch": switchImg,
  "variable": variableImg,
}

const types = [
	{title:"light", data:"light"},
	{title:"switch", data:"switch"},
	{title:"sensors", data:"sensors"}
]

export const ChoiseDevicePage = ({options, setDevice, next, prev}) => {

	const dispatch = useDispatch()

	const choise = (device_class, type)=>{
		if(type === "base")
			dispatch(showConfirmationDialog("choise type", types, (data)=>{
				setDevice(prev=>({...prev, class_device:device_class, type:data}))
				dispatch(hideDialog())
				if(typeof(next)==="function")
					next()
			}))
		else
		{
			setDevice(prev=>({...prev, class_device:device_class, type:type}))
			if(typeof(next)==="function")
				next()
		}
	}

  return options.map((item, index)=>(
        <div key={index}>
				  <div className="dividers text">
            <h2>{item.class_name}</h2>
          </div>
          <div className='add-device-container'>
            {
              item.types.map((item2, index2)=>(
                <MiniCard onClick={()=>choise(item.class_name, item2)} className={"add-device-card"} key={index2} text={item2} defImg={defImg} img={typeImages[item2]}/>
              ))
            }
          </div>
        </div>
      ))
}
