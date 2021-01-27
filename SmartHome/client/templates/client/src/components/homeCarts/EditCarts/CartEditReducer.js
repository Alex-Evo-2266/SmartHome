import {SHOW_EDITCART, HIDE_EDITCART} from '../../types'

const handlers={
  [SHOW_EDITCART]:(state,{payload}) => ({...payload, visible:true}),
  [HIDE_EDITCART]:state => ({...state, visible:false}),
  DEFAULT: state => state
}

export const cartEditReducer = (state, action)=>{
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}
