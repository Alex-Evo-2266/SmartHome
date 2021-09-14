import {SHOW_MENU, HIDE_MENU, EDIT_MENU} from '../types'

const handlers={
  [SHOW_MENU]:(state,{payload}) => ({...state, visible:true}),
  [HIDE_MENU]:state => ({...state, visible:false}),
  [EDIT_MENU]:(state,{payload}) => ({...payload}),
  DEFAULT: state => state
}

export const menuReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
