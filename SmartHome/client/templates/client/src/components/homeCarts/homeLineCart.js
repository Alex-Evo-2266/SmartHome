import React,{useContext} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'
import {CartEditContext} from './EditCarts/CartEditContext'
import {SliderElement} from './CartElement/SliderElement'
import {SensorElement} from './CartElement/SensorElement'
import {ScriptElement} from './CartElement/ScriptElement'
import {WeatherElement} from './CartElement/WeatherElement'
import {useMessage} from '../../hooks/message.hook'

export const HomebaseCart = ({hide,index,name,updata,data,edit=false,add}) =>{
  const {message} = useMessage();
  const {mode} = useContext(EditModeContext)
  const {target} = useContext(CartEditContext)

  function sort(array) {
    let arr = array.slice()
    for (var i = 0; i < arr.length; i++) {
      arr[i].index = i
    }
    for (let i = arr.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if(arr[j].order>arr[j+1].order){
          [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
        }
      }
    }
    return arr
  }

  const deleteElement=(index1)=>{
    message("Удалить?", "dialog", async()=>{
      let mas = data.children.slice();
      let newBtns = mas.filter((item, index2)=>index2!==index1)
      updata(index,{...data,children:newBtns})
    },"no")
  }

  const editElement = (index1,data1)=>{
    console.log(data1);
    if(!data1||!data1.order||!data1.width||!data1.height)
      return
    let mas = data.children.slice();
    mas[index1].order=Number(data1.order)
    mas[index1].width=Number(data1.width)
    mas[index1].height=Number(data1.height)
    updata(index,{...data,children:mas})
  }

  return(
    <ModalWindow
     position="relative"
     hide={
       (mode)?()=>{
         hide(index)
       }:null
     }
     userBtn={
       (mode)?
       ()=>target("base",{...data,index},updata):null
     }
     z={3}
     top={0}
     left={0}
     title={name}
     moving={false}
     heightToolbar={30}>
      <ul className="elementConteiner line">
      {
        <li>
        
        </li>
      }
      </ul>
    </ModalWindow>
  )
}
