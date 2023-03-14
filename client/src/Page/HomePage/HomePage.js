import React,{useEffect} from 'react'
import { useDispatch} from 'react-redux'
import { setTitle } from '../../store/reducers/menuReducer'

// const cardsList = [
//   {
//     title:"base card",
//     data:"base"
//   },
//   {
//     title:"list card",
//     data:"line"
//   },
// ]

export const HomePage = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(setTitle("Home"))
  },[dispatch])

  return(
    <div>

    </div>
  )
}
