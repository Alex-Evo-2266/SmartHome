import React,{useContext,useRef,useEffect} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'
import {CartEditContext} from './EditCarts/CartEditContext'
import {SliderElement} from './CartElement/SliderElement'
import {AddControlContext} from './AddControl/AddControlContext'
import {SensorElement} from './CartElement/SensorElement'
import {ScriptElement} from './CartElement/ScriptElement'
import {СircleRange} from '../circleRange/index'

export const HomelampCart = ({hide,index,name,updata,data,edit=false,add}) =>{
  const {mode} = useContext(EditModeContext)
  const {target} = useContext(CartEditContext)
  const conteiner = useRef(null)
  const element = useRef(null)
  // const {show} = useContext(AddControlContext)

  // const deleteElement=(index1)=>{
  //   let mas = data.children.slice();
  //   let newBtns = mas.filter((item, index2)=>index2!==index1)
  //   updata(index,{...data,children:newBtns})
  // }
  //
  // const editElement = (index1,data1)=>{
  //   if(!data1||!data1.order)
  //     return
  //   let mas = data.children.slice();
  //   mas[index1].order=data1.order
  //   updata(index,{...data,children:mas})
  // }

  useEffect(()=>{
    element.current = new СircleRange(conteiner.current,{type:"all"})
    // element.current
  },[])

  return(
    <ModalWindow
     position="relative"
     hide={
       (mode)?()=>hide(index):null
     }
     userBtn={
       (mode)?()=>target("lamp",{...data,index},updata):null
     }
     z={3}
     top={0}
     left={0}
     title={name}
     moving={false}
     heightToolbar={30}>
     <div className="m" ref={conteiner} style={{height: "120px", width: "100%", overflow:"visible"}}></div>
    </ModalWindow>
  )
}
