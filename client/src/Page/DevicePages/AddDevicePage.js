import React,{useEffect} from 'react'
import { useDispatch} from 'react-redux'
import { setTitle } from '../../store/reducers/menuReducer'


export const AddDevicePage = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(setTitle("Add devices"))
  },[dispatch])

  return(
    <div>
		
    </div>
  )
}
