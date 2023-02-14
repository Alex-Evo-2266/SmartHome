import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideWindow } from '../../store/reducers/modalWindowReducer'
import { BaseModalWindow } from './modalWindowBase'

export const CastomModalWindow = ()=>{

    const window = useSelector(state => state.window)
    const dispatch = useDispatch()

    const hide = ()=>dispatch(hideWindow())

    return(
        <BaseModalWindow visible={window.visible} hide={()=>dispatch(hideWindow())} zIndex={97}>
        <div className="modalWindowCoteiner card-container" style={{width: (window?.options?.width || "560px")}}>
            <div className="card-head">{window.title}</div>
            {window.html}
	        <div className="card-btn-container">
            {
            window.buttons?.map((item, index)=>{
                return(
                    <button key={index} className="btn" onClick={item.action}>{item.title}</button>
                )
            })
            }
            {
            (!window.buttons)?
                <button className="btn" onClick={hide}>Exit</button>
                :null
            }
            </div>
        </div>
        </BaseModalWindow>
    )
}
