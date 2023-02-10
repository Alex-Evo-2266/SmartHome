import React,{useEffect} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
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

export const ScriptPage = () => {

  const dispatch = useDispatch()
  const auth = useSelector(state=>state.auth)

  useEffect(()=>{
    dispatch(setTitle("Scripts"))
  },[dispatch])

  return(
    <div>

        {
		    (auth.role === "admin")?
		    <NavLink className='fab-btn' to="/scripts/add">+</NavLink>:
		    null
		}
    </div>
  )
}
