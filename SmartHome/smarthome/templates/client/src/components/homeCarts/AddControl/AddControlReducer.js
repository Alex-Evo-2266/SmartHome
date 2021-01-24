import {SHOW_ADDCONTROL, HIDE_ADDCONTROL} from '../../types'

const handlers={
  [SHOW_ADDCONTROL]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_ADDCONTROL]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const addControlReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
