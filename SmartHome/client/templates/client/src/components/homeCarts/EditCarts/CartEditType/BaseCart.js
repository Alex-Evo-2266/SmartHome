import React,{useContext,useState,useEffect} from 'react'
import {ModalWindow} from '../../../modalWindow/modalWindow'
import {CartEditContext} from '../CartEditContext'
import {AddControlContext} from '../../AddControl/AddControlContext'
import {InputNumber} from '../../../inputNumber'
import {BackForm} from '../../../backForm'

export const BaseCartEdit = ({type="base"}) =>{
  const {cartEdit, hide} = useContext(CartEditContext)
  const {show} = useContext(AddControlContext)
  const [cart ,setCart] = useState({
    mainId:null,
    id:null,
    name:"",
    type:"base",
    order:"0",
    children:[],
    width:1
  })

  useEffect(()=>{
    if(cartEdit.cart)
      setCart({
        mainId:cartEdit.cart.mainId,
        id:cartEdit.cart.id,
        name:cartEdit.cart.name,
        type:cartEdit.cart.type,
        order:cartEdit.cart.order,
        children:cartEdit.cart.children,
        width:cartEdit.cart.width
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
        <button onClick = {()=>show(
          (type==="line")?
          "AddLineButton":
          "AddButton",
          async(btn)=>{
                let mas = cart.children.slice();
                mas.push(btn)
                cartEdit.OK(cartEdit.cart.index,{...cart,children:mas})
                hide()
            })}>Add Control Element</button>
        <button onClick = {outHandler}>Ок</button>
      </div>
    </ModalWindow>
    </BackForm>
  )

}
