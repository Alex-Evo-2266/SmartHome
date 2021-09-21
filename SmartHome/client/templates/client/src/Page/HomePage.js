import React,{useState,useEffect,useContext,useCallback,useRef} from 'react'
import {EditToolbar} from '../components/homeCarts/EditToolbar'
import {HomebaseCart} from '../components/homeCarts/homeBaseCart'
import {HomeLineCart} from '../components/homeCarts/homeLineCart'
import {EditModeContext} from '../context/EditMode'
import {CartEditState} from '../components/homeCarts/EditCarts/CartEditState'
import {AddControlState} from '../components/homeCarts/AddControl/AddControlState'
import {AddControl} from '../components/homeCarts/AddControl/AddControl'
import {CartEdit} from '../components/homeCarts/EditCarts/CartEdit'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {ScriptContext} from '../context/ScriptContext.js'
import {Loader} from '../components/Loader'
import {MenuContext} from '../components/Menu/menuContext'
import {BtnElement} from '../components/homeCarts/CartElement/BtnElement'
import {SliderElement} from '../components/homeCarts/CartElement/SliderElement'
import {SensorElement} from '../components/homeCarts/CartElement/SensorElement'
import {EnumElement} from '../components/homeCarts/CartElement/EnumElement'
import {ScriptElement} from '../components/homeCarts/CartElement/ScriptElement'
import {WeatherElement} from '../components/homeCarts/CartElement/WeatherElement'
import {BaseElement} from '../components/homeCarts/cards/BaseCard'

const SIZE_ELEMENT = 100
const GAP = 5
const EMPTY_ELEMENT = {
  type: "empty"
}

export const HomePage = () => {

const [editMode, setEditMode] = useState(false);
const [cards, setCards] = useState([])
const auth = useContext(AuthContext)
const {setData} = useContext(MenuContext)
const {message} = useMessage();
const {request, error, clearError} = useHttp();
const conteiner = useRef(null)
const [scripts, setScripts] = useState({})
const [currentItem, setCurrentItem] = useState(null)
const [formCarts, setFormCarts] = useState(false)


const saveCarts = async(carts)=>{
  try {
    console.log(carts);
    await request('/api/homeCart/set', 'POST', {name:"page1",cards:carts},{Authorization: `Bearer ${auth.token}`})
  } catch (e) {
    console.error(e);
  }
}

const addCart = async(type="base")=>{
  let newCart = {
    mainId:null,
    id:cards.length+1,
    name:"",
    order:"0",
    type:type,
    children:[],
    width:2
  }
  await setCards((prev)=>{
    let mas = prev.slice();
    mas.push(newCart)
    return mas;
  })
}

const addElement = async()=>{
  let newElement = {
    deviceId: null,
    height: 1,
    name: "test",
    poz: 1,
    type: "test",
    typeAction: null,
    width: 1,
  }
  await setCards((prev)=>{
    let mas = prev.slice();
    mas.push(newElement)
    saveCarts(mas)
    return mas;
  })
}

const removeCart = async(index)=>{
  message("Удалить?", "dialog", async()=>{
    await setCards((prev)=>{
      let mas = prev.slice();
      return mas.filter((item, index2)=>index2!==index)
    })
  },"no")
}

const updataCart = async(index,cart)=>{
  await setCards((prev)=>{
    let mas = prev.slice();
    mas[index] = cart
    return mas
  })
}



const importCarts = useCallback(async()=>{
  try {
    const data = await request(`/api/homeCart/get/${"page1"}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setCards(data.cards)
    const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setInterval(data2.updateFrequency)
    const data3 = await request(`/api/script/all`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    await setScripts(data3);
  } catch (e) {
    console.error(e);
  }
},[request,auth.token])

const splitType = (type)=>{
  return type.split("-")
}

const deleteElement = ()=>{}

const editElement = ()=>{}

useEffect(()=>{
  message(error,"error")
  return ()=>{
    clearError();
  }
},[error,message, clearError])

useEffect(()=>{
  importCarts()
},[importCarts])

useEffect(()=>{
  console.log(cards);
},[cards])

useEffect(()=>{
  if(!editMode){
    setData("Home",{
      specialAction:{
        type: "config",
        action:()=>{
          addElement()
        }
      },

    }
    )
  }else{
    setData("Home",{
      specialAction:{
        type: "ok",
        action:()=>{
          saveCarts()
          setEditMode(false)
        }
      },
      toolbar:[

      ]
    })
  }
},[setData,editMode])


const dragStartHeandler = (e,card)=>{
  setCurrentItem(card)
  console.log(card);
}

const dragLeaveHeandler = (e)=>{
  // e.preventDefault()
  e.target.closest("div[data-el='drag']").classList.remove("dragOver")
}

const dragEndHeandler = (e,card)=>{
  console.log("end");
  e.target.closest("div[data-el='drag']").classList.remove("dragOver")
  // e.preventDefault()
}

const dragOverHeandler = (e,card)=>{
  e.preventDefault()
  e.target.closest("div[data-el='drag']").classList.add("dragOver")
}

const dropHeandler = (e, card)=>{
  e.preventDefault()
  e.target.closest("div[data-el='drag']").classList.remove("dragOver")
  console.log(card,currentItem);
  setCards(cards.map(c=>{
    if(c.id === currentItem.id)
      return{...c, poz:card.poz }
    if(c.id === card.id)
      return{...c, poz:currentItem.poz }
    return c
  }))
}

const sortCard = (a,b)=>(a.poz > b.poz)?1:-1

const computeCollumn = ()=>Math.floor(conteiner.current.clientWidth / (SIZE_ELEMENT + GAP))

const computefullRow = ()=>{
  const countEl = cards.length
  const columnCount = computeCollumn()
  return Math.ceil(countEl/columnCount)
}

const computeDopEl = ()=>{
  const countEl = cards.length
  const columnCount = computeCollumn()
  const dop = columnCount%countEl
  return dop + columnCount
}

useEffect(()=>{
  if(!formCarts){
    conteiner.current.firstChild.style.gridTemplateColumns = `repeat(${computeCollumn()} ,${SIZE_ELEMENT}px)`
    const t = computeDopEl()
    console.log(t);
    let newArr = cards.slice()
    for (var i = 0; i < t; i++) {
      newArr.push(EMPTY_ELEMENT)
    }
    if(t){
      setCards(newArr)
      setFormCarts(true)
    }
  }
},[cards])

// <EditToolbar show={editMode} save={saveCarts}/>

if(cards===[]){
  return(
    <Loader/>
  )
}

  return(
    <EditModeContext.Provider value={{setMode:setEditMode, mode:editMode,add:addCart}}>
    <ScriptContext.Provider value={{scripts:scripts}}>
    <CartEditState>
    <AddControlState>
      <CartEdit/>
      <AddControl/>

      <div className = {`conteiner top bottom home`}>
        <div ref={conteiner} className = "conteinerHome" data-el="conteiner">
          <div className="gridHome">
        {
          cards?.sort(sortCard).map((item,index)=>{
            return(
              <div className="backElement">
              {
                (item.type==="button")?
                <BtnElement
                key={index}
                disabled={editMode}
                data={item}
                switchMode={item.typeAction==="power"}
                deleteBtn={
                  (editMode)?deleteElement:null
                }
                editBtn={
                  (editMode)?editElement:null
                }
                />:
                (item.type==="slider")?
                <SliderElement
                key={index}
                data={item}
                disabled={editMode}
                deleteBtn={
                  (editMode)?deleteElement:null
                }
                editBtn={
                  (editMode)?editElement:null
                }
                />:
                (splitType(item.type)[0]==="sensor")?
                <SensorElement
                key={index}
                data={item}
                deleteBtn={
                  (editMode)?deleteElement:null
                }
                editBtn={
                  (editMode)?editElement:null
                }
                />:
                (item.type==="script")?
                <ScriptElement
                key={index}
                data={item}
                disabled={editMode}
                deleteBtn={
                  (editMode)?deleteElement:null
                }
                editBtn={
                  (editMode)?editElement:null
                }
                />:
                (item.type==="enum")?
                <EnumElement
                key={index}
                disabled={editMode}
                data={item}
                deleteBtn={
                  (editMode)?deleteElement:null
                }
                editBtn={
                  (editMode)?editElement:null
                }
                />:
                (item.type==="weather")?
                <WeatherElement
                key={index}
                data={item}
                deleteBtn={(editMode)?deleteElement:null}
                editBtn={(editMode)?editElement:null}
                />:
                <BaseElement
                key={index}
                data={item}
                onDragStart={(e)=>dragStartHeandler(e,item)}
                onDragLeave={(e)=>dragLeaveHeandler(e,item)}
                onDragEnd={(e)=>dragEndHeandler(e,item)}
                onDragOver={(e)=>dragOverHeandler(e,item)}
                onDrop={(e)=>dropHeandler(e,item)}
                >
                  <p>fe{item.id}</p>
                </BaseElement>
              }
              </div>
            )
          })
        }
          </div>
        </div>
      </div>
    </AddControlState>
    </CartEditState>
    </ScriptContext.Provider>
    </EditModeContext.Provider>
  )
}
