import React,{useContext,useState} from 'react'
import {ModalWindow} from '../../../modalWindow/modalWindow'
import {CartEditContext} from '../CartEditContext'
import {BackForm} from '../../../moduls/backForm'
import {InputNumber} from '../../../moduls/inputNumber'

export const ButtonEdit = () =>{
  const {cartEdit, hide} = useContext(CartEditContext)
  const [butonConf ,setButonConf] = useState({
    order:"0"
  })

  const outHandler = ()=>{
    if(typeof(cartEdit.OK)!=="function")
      return;
    cartEdit.OK(cartEdit.cart.index,butonConf)
    hide()
  }

  return(
    <BackForm onClick={hide}>
    <ModalWindow hide={hide} title="Edit Cart" moving={false} backForm={true} style={{width:"400px",left:"50%",transform: "translateX(-50%)", top:"100px",maxHeight:"calc(100% - 200px)"}}>
      <div className="editcart-conteiner">
        <div className="editcart-element">
          <p>button priority</p>
          <InputNumber Xten={false} Value={cartEdit.cart.order} result={(v)=>setButonConf({...butonConf,order:v})} min={0} max={500}/>
        </div>
        <button onClick = {outHandler}>Ок</button>
      </div>
    </ModalWindow>
    </BackForm>
  )

}
