import React,{useContext} from 'react'
import {BaseElement} from './BaseElement'
import {ServerConfigContext} from  '../../../context/ServerConfigContext'

export const WeatherElement = ({deleteBtn,editBtn,index,data}) =>{
  const serverConfig = useContext(ServerConfigContext)

  const icon = (weather)=>{
    if(!weather) return null
    if (weather==="Ясно"||weather==="Малооблачно")
      return (<i className="fas fa-sun"></i>)
    else if (weather==="Облачно с прояснениями")
      return (<i className="fas fa-cloud-sun"></i>)
    else if (weather==="Облачно"||weather==="Пасмурно")
      return (<i className="fas fa-cloud"></i>)
    else if (weather==="Дождь")
      return (<i className="fas fa-cloud-showers-heavy"></i>)
    else if (weather==="Небольшой дождь")
      return (<i className="fas fa-cloud-sun-rain"></i>)
  }

  return(
    <BaseElement
    deleteBtn = {deleteBtn}
    editBtn={editBtn}
    index={index}
    data={data}
    >
    {
      (serverConfig&&serverConfig.weather)?
      <div className="weather-box">
        <div className="city">{(serverConfig&&serverConfig.weather&&serverConfig.weather.city)||""}</div>
        <div className={`weather-body ${(data.width>3)?"veryWide":(data.width>1)?"wide":""} ${(data.height>2)?"veryTall":(data.height>1)?"tall":""}`}>
          <div className="day_anchor-div">
            <div className="icon_color_light">{
              icon(serverConfig&&serverConfig.weather&&serverConfig.weather.now.weather)
            }</div>
            {
              (data.width>1||data.height>1)?
              <div className="day-anchor">{(serverConfig&&serverConfig.weather&&serverConfig.weather.now.weather)||""}</div>
              :null
            }
          </div>
          <div className="temp">{(serverConfig&& serverConfig.weather&&serverConfig.weather.now.temp)||""} C*</div>
        </div>
        {
          (data.width>3&&data.height>1)?
          <div className="forecast">
            {
              (serverConfig&&serverConfig.weather&&serverConfig.weather.tenDays)?
              serverConfig.weather.tenDays.map((item,index)=>{
                return(
                  <div key={index} className={`forecast-weather-body`}>
                    <div className="day-name">{item.name||""}</div>
                    <div className="day-date">{item.date||""}</div>
                    <div className="day_anchor-div">
                      <div className="icon_color_light">{
                        icon(item&&item.weather)
                      }</div>
                      <div className="day-anchor">{item.weather||""}</div>
                    </div>
                    <div className="forecast-temp forecast-temp-day">{(item&&item.day)||""} C*</div>
                    <div className="forecast-temp forecast-temp-night">{(item&&item.night)||""} C*</div>
                  </div>
                )
              })
              :null
            }
          </div>
          :null
        }
      </div>
      :<div className="weather-box" style={{fontSize:"30px", flexDirection:"column", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <p>weather</p>
        <p>Нет данных</p>
      </div>
    }
    </BaseElement>
  )
}
