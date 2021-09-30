import React,{useContext,useState,useEffect,useCallback} from 'react'
import {ModalWindow} from '../modalWindow/modalWindow'
import {BtnElement} from './CartLineElement/BtnElement'
import {EditModeContext} from '../../context/EditMode'
import {SocketContext} from '../../context/SocketContext'
import {CartEditContext} from './EditCarts/CartEditContext'
import {SliderElement} from './CartLineElement/SliderElement'
import {SensorElement} from './CartLineElement/SensorElement'
import {ScriptElement} from './CartLineElement/ScriptElement'
import {EnumElement} from './CartLineElement/EnumElement'
import {TextElement} from './CartLineElement/TextElement'
// import {WeatherElement} from './CartElement/WeatherElement'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'

export const HomeLineCart = ({hide,index,name,updata,data,edit=false,add}) =>{
  const {message} = useMessage();
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const {request} = useHttp();
  const {mode} = useContext(EditModeContext)
  const {target} = useContext(CartEditContext)
  const [act, setAct] = useState(isPowerActiv(data.children))

  const isPowerActivcallback = useCallback(isPowerActiv,[devices])

  function isPowerActiv(array){
    for (var item of array)
      if(item.typeAction==="power"){
        let id = item.deviceId
        let condidat = devices.filter((item2)=>(item2&&(item2.DeviceId===id)))
        if(condidat[0]){
          let congDev = condidat[0].DeviceConfig.filter((item2)=>item2&&item2.type==="power")
          congDev = congDev[0]||{}
          if(condidat[0]&&condidat[0].DeviceValue&&(condidat[0].DeviceValue.power===congDev.high||(condidat[0].DeviceTypeConnect!=="mqtt"&&condidat[0].DeviceValue.power==="1"))){
            return true
          }
          if(condidat[0]&&condidat[0].DeviceTypeConnect==="mqtt"&&(!/\D/.test(condidat[0].DeviceValue.power)&&!/\D/.test(congDev.low)&&!/\D/.test(congDev.high))){
            let poz = Number(condidat[0].DeviceValue.power)
            let min = Number(congDev.low)
            let max = Number(congDev.high)
            if(poz>min&&poz<=max)
              return true
          }
        }
      }
    return false
  }

  useEffect(()=>{
    setAct(isPowerActivcallback(data.children))
  },[isPowerActivcallback,data.children])

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

  function isPowerAct(array) {
    let countpower = 0
    for (var item of array)
      if(item.typeAction==="power"||item.typeAction==="state")
        countpower++
      if(countpower>=2)
        return true
    return false
  }

  function allPower(array,value) {
    setAct(value)
    for (var item of array)
      if(item.typeAction==="power")
        request('/api/devices/value/set', 'POST', {id: item.deviceId,type:item.typeAction,status:value},{Authorization: `Bearer ${auth.token}`})
    return false
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
        (data&&data.children&&isPowerAct(data.children))?
        <li>
          <div className="line-el">
            <BtnElement
            disabled={edit}
            name="all"
            baseswitchMode={true}
            firstValue={act}
            icon="fas fa-power-off"
            onClick={(event,value)=>{
              allPower(data.children,value)
            }}
            />
          </div>
        </li>
        :null
      }
      {
        (data&&data.children)?
        sort(data.children).map((item,index)=>{
          return(
            <li key={index}>
              {
                (item.type==="button")?
                  <div className="line-el">
                    <BtnElement
                    index={item.index}
                    disabled={edit}
                    data={item}
                    deleteBtn={
                      (edit)?deleteElement:null
                    }
                    editBtn={
                      (edit)?editElement:null
                    }
                    />
                  </div>:
                  (item.type==="enum")?
                  <div className="line-el">
                  <EnumElement
                  index={item.index}
                  disabled={edit}
                  data={item}
                  deleteBtn={
                    (edit)?deleteElement:null
                  }
                  editBtn={
                    (edit)?editElement:null
                  }
                  />
                  </div>:
                  (item.type==="text")?
                  <div className="line-el">
                  <TextElement
                  index={item.index}
                  disabled={edit}
                  data={item}
                  deleteBtn={
                    (edit)?deleteElement:null
                  }
                  editBtn={
                    (edit)?editElement:null
                  }
                  />
                  </div>:
                  (item.type==="slider")?
                  <div className="line-el">
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
                  />
                  </div>
                  :(item.type==="script")?
                    <div className="line-el">
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
                    />
                    </div>
                    :(splitType(item.type)[0]==="sensor")?
                      <div className="line-el">
                      <SensorElement
                      index={item.index}
                      data={item}
                      disabled={edit}
                      deleteBtn={
                        (edit)?deleteElement:null
                      }
                      editBtn={
                        (edit)?editElement:null
                      }
                      />
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
