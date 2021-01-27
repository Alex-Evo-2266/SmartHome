import React,{useContext} from 'react'
import {BtnElement} from './CartElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'

export const EditToolbar = ({show=false,save=null}) => {
  const {setMode,add} = useContext(EditModeContext)

  return(
    <div className={`toolbar ${(show)?"active":""}`}>
      <ul className="elementConteiner top">
        <li>
          <BtnElement switchMode={false} onClick={()=>{
            add()
          }}>
            <i className="far fa-window-restore"></i>
          </BtnElement>
        </li>
        <li>
          <BtnElement switchMode={false} onClick={()=>{
            if(typeof(save)==="function")
              save()
            setMode(false)
          }}>
            <i className="fas fa-check"></i>
          </BtnElement>
        </li>
      </ul>
    </div>
  )
}
