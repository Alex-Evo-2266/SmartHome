import React,{useContext,useState,useEffect} from 'react'
import {ModalWindow} from '../../../modalWindow/modalWindow'
import {CartEditContext} from '../CartEditContext'
import {InputNumber} from '../../../moduls/inputNumber'
import {BackForm} from '../../../moduls/backForm'

export const BaseCartEdit = () =>{
  const {cartEdit, hide} = useContext(CartEditContext)
  const [cart ,setCart] = useState({
    name:"",
    type:"base",
    order:"0",
    children:[]
  })

  useEffect(()=>{
    if(cartEdit.cart)
      setCart({
        name:cartEdit.cart.name,
        type:cartEdit.cart.type,
        order:cartEdit.cart.order,
        children:cartEdit.cart.children
      })
  },[cartEdit])

  const changeHandler = event => {
    setCart({ ...cart, [event.target.name]: event.target.value })
  }

  const outHandler = ()=>{
    if(typeof(cartEdit.OK)!=="function")
      return;
    cartEdit.OK(cartEdit.cart.index,cart)
    hide()
  }

  return(
    <BackForm onClick={hide}>
    <ModalWindow hide={hide} title="Edit Cart" moving={false} backForm={true} style={{width:"400px",left:"50%",transform: "translateX(-50%)", top:"100px",maxHeight:"calc(100% - 200px)"}}>
      <div className="editcart-conteiner">
        <p>сontainer ID: {cartEdit.cart.id}</p>
        <div className="editcart-element">
          <p>сontainer name</p>
          <input type="text" value={(cart)?cart.name:""} name="name" onChange={changeHandler}/>
        </div>
        <div className="editcart-element">
          <p>button priority</p>
          <InputNumber Xten={false} Value={cartEdit.cart.order||"0"} result={(v)=>setCart({...cart,order:v})} min={0} max={500}/>
        </div>
        <button onClick = {outHandler}>Ок</button>
      </div>
    </ModalWindow>
    </BackForm>
  )

}
