import React,{useState,useEffect,useContext,useCallback,useRef} from 'react'
import {HomeControlCart} from '../components/homeCarts/homeControlCart'
import {EditToolbar} from '../components/homeCarts/EditToolbar'
import {HomebaseCart} from '../components/homeCarts/homeBaseCart'
import {EditModeContext} from '../context/EditMode'
import {CartEditState} from '../components/homeCarts/EditCarts/CartEditState'
import {AddControlState} from '../components/homeCarts/AddControl/AddControlState'
import {AddControl} from '../components/homeCarts/AddControl/AddControl'
import {CartEdit} from '../components/homeCarts/EditCarts/CartEdit'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {ScriptContext} from '../context/ScriptContext.js'

export const HomePage = () => {

const [editMode, setEditMode] = useState(false);
const [carts, setCarts] = useState([])
const [sortedCarts, setSortedCarts] = useState([])
const auth = useContext(AuthContext)
const {message} = useMessage();
const {request, error, clearError} = useHttp();
const conteiner = useRef(null)
const [scripts, setScripts] = useState({})

const addCart = async(type="base")=>{
  let newCart = {
    mainId:null,
    id:carts.length+1,
    name:"",
    order:"0",
    type:type,
    children:[]
  }
  await setCarts((prev)=>{
    let mas = prev.slice();
    mas.push(newCart)
    return mas;
  })
}

const removeCart = async(index)=>{
  await setCarts((prev)=>{
    let mas = prev.slice();
    return mas.filter((item, index2)=>index2!==index)
  })
}

const updataCart = async(index,cart)=>{
  await setCarts((prev)=>{
    let mas = prev.slice();
    mas[index] = cart
    return mas
  })
}

const saveCarts = async()=>{
  try {
    await request('/api/homeCart/set', 'POST', {id:1,name:"page1",carts},{Authorization: `Bearer ${auth.token}`})
  } catch (e) {
    console.error(e);
  }
}

const importCarts = useCallback(async()=>{
  try {
    const data = await request(`/api/homeCart/get/${1}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setCarts(data.page.carts)
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
  sortCard(carts)
},[carts])

function sortCard(data) {
  let column = 4
  let i = 1
  let width = conteiner.current.clientWidth
  if(width < 1000)
    column = 3
  if(width < 720)
    column = 2
  if(width < 450){
    i=0
    column = 1
  }
  let arr = []
  for (var j = 0; j < column; j++) {
    arr.push([])
  }
  for (var j = 0; j < data.length; j++) {
    let item = data[j]
    if(arr[i]){
      arr[i].push({...item, index:j})
      i++
      if(i>=column)
        i=0
    }
  }
  setSortedCarts(arr)
}

  return(
    <EditModeContext.Provider value={{setMode:setEditMode, mode:editMode,add:addCart}}>
    <ScriptContext.Provider value={{scripts:scripts}}>
    <CartEditState>
    <AddControlState>
      <CartEdit/>
      <AddControl/>
      <EditToolbar show={editMode} save={saveCarts}/>
      <div className = {`conteiner home ${(editMode)?"editMode":""}`}>
        <div ref={conteiner} className = "conteinerHome flexHome">
        {
          sortedCarts.map((item,index)=>{
            return(
              <div key={index} className="home-column">
              {
              (index===0)?
              <div className = "flexElement">
                <HomeControlCart/>
              </div>
              :null
              }
              {
                item.map((item2,index2)=>{
                  return(
                    <div className = "flexElement" key={index2} style={{order:item2.order}}>
                    {
                      (item2.type==="base")?
                      <HomebaseCart
                      edit={editMode}
                      hide={(i)=>removeCart(i)}
                      updata={updataCart}
                      index={item2.index}
                      data = {item2}
                      name={item2.name}
                      />
                      :null
                    }
                    </div>
                  )
                })
              }
              </div>
            )
          })
        }
        </div>
      </div>
    </AddControlState>
    </CartEditState>
    </ScriptContext.Provider>
    </EditModeContext.Provider>
  )
}
