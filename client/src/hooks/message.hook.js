import {useState, useCallback} from 'react'
import { useDispatch } from 'react-redux';
import { HIDE_ALERT, SHOW_ALERT } from '../store/types';

export const useMessage = () => {
  const [Message, setMessage] = useState('');
  const dispatch = useDispatch()

  const message = useCallback((text, type) =>{
      if(text){
        setMessage(text)
        dispatch({type:SHOW_ALERT, payload:{type, text, title: type}})
      }
      // setTimeout(function () {
      //   setMessage('')
      //   hide()
      // }, 30000);
    },[dispatch])

  const clearMessage = () => {
    setMessage('')
    dispatch({type:HIDE_ALERT})
  }
  return {message,Message,clearMessage}
}
