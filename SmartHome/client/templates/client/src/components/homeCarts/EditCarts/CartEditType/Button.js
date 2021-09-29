import React,{useContext,useState} from 'react'
import {ModalWindow} from '../../../modalWindow/modalWindow'
import {CartEditContext} from '../CartEditContext'
import {BackForm} from '../../../backForm'
import {InputNumber} from '../../../inputNumber'

export const ButtonEdit = ({type}) =>{
  const {cartEdit, hide} = useContext(CartEditContext)
  const [butonConf ,setButonConf] = useState({
    order:String(cartEdit.cart.order),
    width:cartEdit.cart.width,
    height:cartEdit.cart.height
  })

  const outHandler = ()=>{
    if(typeof(cartEdit.OK)!=="function")
      return;
    cartEdit.OK(cartEdit.cart.index,butonConf)
    hide()
  }

  return(
    <BackForm onClick={hide}>
    <ModalWindow hide={hide} title="Edit Cart" moving={false} backForm={true} heightToolbar={30} styleContent={{height:"calc(100% - 30px"}} style={{width:"400px",height:"calc(100% - 200px)",left:"50%",transform: "translateX(-50%)", top:"100px",}}>
      <div className="editcart-conteiner">
        <div className="editcart-element">
          <p>button priority</p>
          <InputNumber Xten={false} Value={cartEdit.cart.order} result={(v)=>setButonConf({...butonConf,order:v})} min={0} max={500}/>
        </div>
        {
          (type!=="button-line")?
          <>
          <div className="editcart-element">
            <p>width</p>
            <InputNumber Xten={false} Value={cartEdit.cart.width} result={(v)=>setButonConf({...butonConf,width:v})} min={1} max={4}/>
          </div>
          <div className="editcart-element">
            <p>height</p>
            <InputNumber Xten={false} Value={cartEdit.cart.height} result={(v)=>setButonConf({...butonConf,height:v})} min={1} max={4}/>
          </div>
          </>
          :null
        }
        <button onClick = {outHandler}>Ок</button>
      </div>
    </ModalWindow>
    </BackForm>
  )

}
