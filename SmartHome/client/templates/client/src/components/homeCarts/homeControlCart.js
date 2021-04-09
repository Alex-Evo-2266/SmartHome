import React,{useContext} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'

export const HomeControlCart = () =>{
  const {setMode} = useContext(EditModeContext)
  return(
    <ModalWindow position = "relative" heightToolbar={30} z={3} top={0} left={0} width={"auto"} height={"auto"} title="controlPanel" moving={false}>
      <ul className="elementConteiner">
        <li>
          <BtnElement switchMode={false} onClick={()=>{
            setMode(true)
          }}>
            <i className="fas fa-cog"></i>
          </BtnElement>
        </li>
      </ul>
    </ModalWindow>
  )
}
