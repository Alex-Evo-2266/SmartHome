import React,{useContext} from 'react'
import {TypeDeviceContext} from '../../components/typeDevices/typeDevicesContext.js'
import socketImg from '../../img/socket.png'
import sensorImg from '../../img/sensor.png'
import lampImg from '../../img/lamp.png'
import switchImg from '../../img/switch.png'
import relayImg from '../../img/relay.jpg'
import variableImage from '../../img/variable.png'

const images = {
  lamp: lampImg,
  light: lampImg,
  switch: switchImg,
  relay: relayImg,
  socket: socketImg,
  sensor: sensorImg,
  variable: variableImage
}

function getImage(name) {
  for (var key in images) {
    if(name.indexOf(key) !== -1)
      return images[key]
  }
}

export const AddDevicesPage1 = ({form, setForm, next}) => {
  const {type} = useContext(TypeDeviceContext)

  const choisetype = (typedev, typeconnect)=>{
    setForm({...form, type:typedev, typeConnect:typeconnect})
    next()
  }

  return(
    <>
      <ul className="leftlist"></ul>
      <div className="devicesTypeListConteiner">
        {
          type?.map((item,index)=>{
            return(
              <div key={index} className="typeDevice">
                <div className="configTitle">
                  <p>{item.title}</p>
                </div>
                <div className="typeDeviceConteiner">
                {
                  item.typs?.map((item2, index2)=>{
                    return(
                      <div className="card" key={index2} onClick = {()=>choisetype(item2, item.title)}>
                        <div className="imgConteiner">
                          <img src={item.img||getImage(item2)} alt={item2}/>
                        </div>
                        <p>{`${item2}`}</p>
                        <p>{`(${item.title})`}</p>
                      </div>
                    )
                  })
                }
                </div>
                <div className="dividers"></div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}
