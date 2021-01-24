import {SHOW_ADDSCRIPT, HIDE_ADDSCRIPT} from '../types'

const handlers={
  [SHOW_ADDSCRIPT]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_ADDSCRIPT]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const addScriptReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
