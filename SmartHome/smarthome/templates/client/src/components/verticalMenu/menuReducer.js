import {SHOW_MENU, HIDE_MENU} from '../types'

const handlers={
  [SHOW_MENU]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_MENU]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const menuReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
