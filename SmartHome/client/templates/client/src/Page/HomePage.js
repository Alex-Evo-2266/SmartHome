import React,{useState,useEffect,useContext,useCallback,useRef} from 'react'
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
import {HomeGrid} from '../components/HomeModuls/HomeGrid'

export const HomePage = () => {

const [editMode, setEditMode] = useState(false);
const [cards, setCards] = useState([])
const auth = useContext(AuthContext)
const {setData} = useContext(MenuContext)
const {message} = useMessage();
const {request, error, clearError} = useHttp();
const conteiner = useRef(null)
const [scripts, setScripts] = useState({})

const saveCarts = useCallback(async(carts)=>{
  try {
    console.log(carts);
    await request('/api/homeCart/set', 'POST', {name:"page1",cards:carts},{Authorization: `Bearer ${auth.token}`})
  } catch (e) {
    console.error(e);
  }
},[request, auth.token])

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
          // addElement()
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
},[setData,editMode,saveCarts])

useEffect(()=>{

},[cards])

if(!cards||cards===[]){
  return(
    <Loader/>
  )
}

  return(
    <EditModeContext.Provider value={{setMode:setEditMode, mode:editMode,add:null}}>
    <ScriptContext.Provider value={{scripts:scripts}}>
    <CartEditState>
    <AddControlState>
      <CartEdit/>
      <AddControl/>

      <div className = {`conteiner top bottom home`}>
        <div ref={conteiner} className = "conteinerHome" data-el="conteiner">
          <HomeGrid cards={cards} conteiner={conteiner} setCards={setCards}/>
        </div>
      </div>
    </AddControlState>
    </CartEditState>
    </ScriptContext.Provider>
    </EditModeContext.Provider>
  )
}
