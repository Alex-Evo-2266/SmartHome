import React,{useContext} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'
import {CartEditContext} from './EditCarts/CartEditContext'
import {SliderElement} from './CartElement/SliderElement'
import {AddControlContext} from './AddControl/AddControlContext'
import {SensorElement} from './CartElement/SensorElement'
import {ScriptElement} from './CartElement/ScriptElement'

export const HomebaseCart = ({hide,index,name,updata,data,edit=false,add}) =>{
  const {mode} = useContext(EditModeContext)
  const {target} = useContext(CartEditContext)
  const {show} = useContext(AddControlContext)

  const deleteElement=(index1)=>{
    let mas = data.children.slice();
    let newBtns = mas.filter((item, index2)=>index2!==index1)
    updata(index,{...data,children:newBtns})
  }

  const editElement = (index1,data1)=>{
    if(!data1||!data1.order)
      return
    let mas = data.children.slice();
    mas[index1].order=data1.order
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
      <ul className="elementConteiner">
      {

        (data&&data.children)?
        data.children.map((item,indexbtn)=>{
          return (
            <li key={indexbtn} className={`grid-width-${item.width}`} style={{order:`${item.order||"0"}`}}>
            {
              (item.type==="button")?
              <BtnElement
              index={indexbtn}
              disabled={edit}
              data={item}
              switchMode={item.typeAction==="power"}
              deleteBtn={
                (edit)?deleteElement:null
              }
              editBtn={
                (edit)?editElement:null
              }
              >
                {
                  (item.typeAction==="power")?
                  <i className="fas fa-power-off"></i>:
                  (item.typeAction==="dimmer")?
                  <i className="fas fa-sun"></i>:
                  (item.typeAction==="temp")?
                  <i className="fas fa-adjust"></i>:
                  (item.typeAction==="color")?
                  <i className="fas fa-palette"></i>:
                  (item.typeAction==="mode")?
                  <i>M {item.action}</i>:
                  (item.typeAction==="ir")?
                  <i className="fas fa-tv"></i>:
                  <i>M</i>
                }
              </BtnElement>:
              (item.type==="slider")?
              <SliderElement
              index={indexbtn}
              data={item}
              disabled={edit}
              deleteBtn={
                (edit)?deleteElement:null
              }
              editBtn={
                (edit)?editElement:null
              }
              />:
              (item.type==="sensor")?
              <SensorElement
              index={indexbtn}
              data={item}
              deleteBtn={
                (edit)?deleteElement:null
              }
              editBtn={
                (edit)?editElement:null
              }
              />:
              (item.type==="script")?
              <ScriptElement
              index={indexbtn}
              data={item}
              disabled={edit}
              deleteBtn={
                (edit)?deleteElement:null
              }
              editBtn={
                (edit)?editElement:null
              }
              />:
              null
            }
            </li>
          )
        }):null
      }
      {
        (edit)?
        <li style={{order:`501`}}>
          <BtnElement switchMode={false} onClick={()=>show("AddButton",async(btn)=>{
              let mas = data.children.slice();
              mas.push(btn)
              updata(index,{...data,children:mas})
          })}>
            <i className="fas fa-plus"></i>
          </BtnElement>
        </li>
        :null
      }
      </ul>
    </ModalWindow>
  )
}
