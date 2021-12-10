import React, {useState} from 'react'

const iconList = [
  "fas fa-lightbulb",
  "far fa-lightbulb",
  "fas fa-adjust",
  "fas fa-bath",
  "fas fa-sun",
  "fas fa-broadcast-tower",
  "fas fa-cog",
  "fas fa-bell",
  "fas fa-bolt",
  "fas fa-city",
  "fas fa-home",
  "fas fa-desktop",
  "fas fa-moon",
  "fas fa-power-off",
  "fas fa-rss",
  "fas fa-door-closed",
  "fas fa-door-open",
  "fas fa-cogs",
  "fas fa-circle-notch"
]

export const IconChoose = ({value, onChange, dataId}) =>{
  const [visible, setVisible] = useState(false)

  const changeHandler = (event)=>{
    onChange(event.target.dataset.val, dataId)
  }

  return(
  <>
    <div className="configElement">
      <div className="input-data-icon" onClick={()=>setVisible(!visible)}>
        <div className="IconChooseflex">
          <p>icon</p>
          <div className="iconEl">
            <i className={value}></i>
          </div>
        </div>
        <div className="dividers"></div>
        <div className={`chooseIcon ${(visible)?"show":""}`}>
          <div className="iconConteiner">
          {
            iconList.map((item, index)=>{
              return(
                <div key={index} data-id={dataId} onClick={changeHandler} data-val={item} className="iconEl">
                  <i className={item}></i>
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
