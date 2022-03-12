import {SHOW_GROUP, HIDE_GROUP} from '../types'

const handlers={
  [SHOW_GROUP]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_GROUP]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const formReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
