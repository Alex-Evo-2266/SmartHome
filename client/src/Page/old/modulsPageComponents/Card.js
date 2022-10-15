import React from 'react'
import {RunText} from '../../components/runText'
import {useDecodePath} from './pathDecodhook'

export const Card = ({conf={}, data={}}) =>{
  const {getfields} = useDecodePath()

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <RunText className="DeviceName" id={getfields(conf?.title, data)} text={getfields(conf?.title, data)}/>
      </div>
      <div className="dividers"></div>
      <div className = "NewCardBody">
        <ul>
        {
          conf?.fields?.map((item,index)=>{
            return(
              <li className="DeviceControlLi" key={index}>
                <div className="DeviceControlLiName">
                  <p>{getfields(item.title, data)}</p>
                </div>
                <div className="DeviceControlLiContent">
                  <div className="DeviceControlLiValue">
                    <p>{getfields(item.value, data)}</p>
                  </div>
                </div>
              </li>
            )
          })
        }
        </ul>
      </div>
    </div>
  )
}
