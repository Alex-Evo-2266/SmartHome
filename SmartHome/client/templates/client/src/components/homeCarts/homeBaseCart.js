import React,{useContext,useRef} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'
import {CartEditContext} from './EditCarts/CartEditContext'
import {SliderElement} from './CartElement/SliderElement'
import {AddControlContext} from './AddControl/AddControlContext'
import {SensorElement} from './CartElement/SensorElement'
import {ScriptElement} from './CartElement/ScriptElement'

const COLUMNS = 4
export const HomebaseCart = ({hide,index,name,updata,data,edit=false,add}) =>{
  const {mode} = useContext(EditModeContext)
  const {target} = useContext(CartEditContext)
  const {show} = useContext(AddControlContext)
  const column = useRef(1)
  // const row = useRef(1)
  const map = useRef([])

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
    let mas = data.children.slice();
    let newBtns = mas.filter((item, index2)=>index2!==index1)
    updata(index,{...data,children:newBtns})
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
      <ul className="elementConteiner">
      {
        (data&&data.children)?
        sort(data.children).map((item,indexbtn)=>{

          if(indexbtn === 0){
            column.current = 1
            // row.current = 1
          }
          if(COLUMNS-(column.current-1)<item.width){
            column.current = 1
            // row.current += 1
          }
          let start = column.current
          let end = column.current + item.width
          column.current += item.width


          return (
            <li key={indexbtn} style={{
              gridColumnStart:start,
              gridColumnEnd:end,
            }}>
            {
              (item.type==="button")?
              <BtnElement
              index={item.index}
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
              index={item.index}
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
              index={item.index}
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
              index={item.index}
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
