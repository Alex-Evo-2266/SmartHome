import {SHOW_TERMINAL, HIDE_TERMINAL} from '../types'

const handlers={
  [SHOW_TERMINAL]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_TERMINAL]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const terminalReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
