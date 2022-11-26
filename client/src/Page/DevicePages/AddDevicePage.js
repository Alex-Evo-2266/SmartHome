import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { useHttp } from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import { setTitle } from '../../store/reducers/menuReducer'
import defImg from '../../img/chipflat.png'
import lampImg from '../../img/lamp.png'
import switchImg from '../../img/lamp.png'
import variableImg from '../../img/variable.png'
import { MiniCard } from '../../components/cards/miniCard'

const typeImages = {
  "lamp": lampImg,
  "switch": switchImg,
  "variable": variableImg
}

export const AddDevicePage = () => {

  const dispatch = useDispatch()
  const {message} = useMessage();
  const auth = useSelector(state=>state.auth)
  const {request, error, clearError} = useHttp();
  const [options, setOptions] = useState([])

  const getOptions = useCallback(async()=>{
    const data = await request("/api/devices/options", "GET", null, {Authorization: `Bearer ${auth.token}`})
    if(data && Array.isArray(data))
      setOptions(data)
  },[request, auth.token])

  useEffect(()=>{
    getOptions()
  },[getOptions])

  useEffect(()=>{
    message(error, 'error');
    clearError();
    return ()=>clearError()
  },[error, message, clearError])

  useEffect(()=>{
    dispatch(setTitle("Add devices"))
  },[dispatch])

  return(
    <div className='container normal-color'>
		{
      options.map((item, index)=>(
        <div key={index}>
				  <div className="dividers text">
            <h2>{item.class_name}</h2>
          </div>
          <div className='add-device-container'>
            {
              item.types.map((item2, index2)=>(
                <MiniCard className={"add-device-card"} key={index2} text={item2} defImg={defImg} img={typeImages[item2]}/>
              ))
            }
          </div>
        </div>
      ))
    }
    </div>
  )
}
