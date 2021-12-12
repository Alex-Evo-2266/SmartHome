import {SHOW_DIALOG, HIDE_DIALOG} from '../types'

const handlers={
  [SHOW_DIALOG]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_DIALOG]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const dialogWindowReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
