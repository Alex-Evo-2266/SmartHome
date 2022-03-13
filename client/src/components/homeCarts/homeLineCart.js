import React,{useContext} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartLineElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'
import {CartEditContext} from './EditCarts/CartEditContext'
import {SliderElement} from './CartLineElement/SliderElement'
import {SensorElement} from './CartLineElement/SensorElement'
import {ScriptElement} from './CartLineElement/ScriptElement'
import {EnumElement} from './CartLineElement/EnumElement'
import {TextElement} from './CartLineElement/TextElement'
// import {WeatherElement} from './CartElement/WeatherElement'
import {useMessage} from '../../hooks/message.hook'
import {useControlData} from '../../hooks/controlData.hook'

export const HomeLineCart = ({hide,index,name,updata,data,edit=false,add}) =>{
  const {message} = useMessage();
  const {convert} = useControlData();
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

  const splitType = (type)=>{
    return type.split("-")
  }

  const editElement = (index1,data1)=>{
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
       ()=>target("line",{...data,index},updata):null
     }
     z={3}
     top={0}
     left={0}
     title={name}
     moving={false}
     heightToolbar={30}>
      <ul className="elementConteiner line">
      {
        (data&&data.children)?
        sort(data.children).map((item,index)=>{
          return(
            <li key={index}>
              {
                (item.type==="button")?
                  <div className="line-el">
                    <BtnElement data={convert(item, edit)} index={item.index} deleteBtn={deleteElement} editBtn={editElement}/>
                  </div>:
                  (item.type==="enum")?
                  <div className="line-el">
                    <EnumElement data={convert(item, edit)} index={item.index} deleteBtn={deleteElement} editBtn={editElement}/>
                  </div>:
                  (item.type==="text")?
                  <div className="line-el">
                    <TextElement data={convert(item, edit)} index={item.index} deleteBtn={deleteElement} editBtn={editElement}/>
                  </div>:
                  (item.type==="slider")?
                  <div className="line-el">
                    <SliderElement data={convert(item, edit)} index={item.index} deleteBtn={deleteElement} editBtn={editElement}/>
                  </div>
                  :(item.type==="script")?
                  <div className="line-el">
                    <ScriptElement data={convert(item, edit)} index={item.index} deleteBtn={deleteElement} editBtn={editElement}/>
                  </div>
                  :(splitType(item.type)[0]==="sensor")?
                  <div className="line-el">
                    <SensorElement data={convert(item, edit)} index={item.index} deleteBtn={deleteElement} editBtn={editElement}/>
                  </div>
                  :null
              }
            </li>
          )
        })
        :null
      }
      </ul>
    </ModalWindow>
  )
}
