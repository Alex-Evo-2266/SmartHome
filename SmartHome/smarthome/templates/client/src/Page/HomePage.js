import React,{useState,useEffect,useContext,useCallback} from 'react'
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
import {DeviceStatusContext} from '../context/DeviceStatusContext'

export const HomePage = () => {

// const heightElement = 80

const [editMode, setEditMode] = useState(false);
const [carts, setCarts] = useState([])
const auth = useContext(AuthContext)
const {message} = useMessage();
const {request, error, clearError} = useHttp();
const [devices, setDevices] = useState({})
const [scripts, setScripts] = useState({})
const [interval, setInterval] = useState(2)
const [cost, setCost] = useState(true)

const addCart = async(type="base")=>{
  let newCart = {
    id:carts.length,
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
    await request('/api/homeConfig/config/edit', 'POST', {carts},{Authorization: `Bearer ${auth.token}`})
  } catch (e) {
    console.error(e);
  }
}

const importCarts = useCallback(async()=>{
  try {
    const data = await request('/api/homeConfig/config', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setCarts(data.homePage.carts)
    const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setInterval(data2.server.updateFrequency)
    const data3 = await request(`/api/script/all`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    await setScripts(data3);
  } catch (e) {
    console.error(e);
  }
},[request,auth.token])

const updateDevice = useCallback(async()=>{
  try {
    const data = await request(`/api/devices/all`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    await setDevices(data);
  } catch (e) {
    console.error(e);
  }
},[request,auth.token])

useEffect(() => {
  const interval2 = setTimeout(() => {
    updateDevice()
    setCost((prev)=>!prev)
  }, interval*1000);
  return () => {
    return clearTimeout(interval2);
  }
},[cost,interval,updateDevice]);

useEffect(()=>{
  message(error,"error")
  return ()=>{
    clearError();
  }
},[error,message, clearError])

useEffect(()=>{
  importCarts()
  updateDevice()
},[importCarts,updateDevice])

// useEffect(()=>{
//   let elements = document.getElementsByClassName('gridElement')
//   for (var item of elements) {
//     if(item.firstChild.offsetHeight>heightElement){
//       let poz = Math.floor(item.firstChild.offsetTop/heightElement)+1
//       let size = Math.floor(item.firstChild.offsetHeight/heightElement)+1
//       item.style = `grid-row-start:${poz}; grid-row-end:${poz+size};`
//     }
//   }
// })

  return(
    <EditModeContext.Provider value={{setMode:setEditMode, mode:editMode,add:addCart}}>
    <DeviceStatusContext.Provider value={{script:scripts,devices:devices, updateDevice:updateDevice}}>
    <CartEditState>
    <AddControlState>
      <CartEdit/>
      <AddControl/>
      <EditToolbar show={editMode} save={saveCarts}/>
      <div className = {`conteiner home ${(editMode)?"editMode":""}`}>
        <div className = "conteinerHome HomeGrid" id="homeGrid">
          <div className = "gridElement">
            <HomeControlCart/>
          </div>
          {
            carts.map((item,index)=>{
              return(
                <div className = "gridElement" key={index} style={{order:item.order}}>
                {
                  (item.type==="base")?
                  <HomebaseCart edit={editMode} hide={(i)=>removeCart(i)} updata={updataCart} index={index} data = {item} name={item.name}/>
                  :null
                }
                </div>
              )
            })
          }
        </div>
      </div>
    </AddControlState>
    </CartEditState>
    </DeviceStatusContext.Provider>
    </EditModeContext.Provider>
  )
}
