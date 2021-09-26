import React,{useContext} from 'react'
import {FormContext} from '../../Form/formContext'
import {RunText} from '../../runText'


export const ZigbeeElement = ({data}) =>{
  const form = useContext(FormContext)

  const linc = ()=>{
    let conf = []
    for (var item of data.exposes) {
      let type = item.type
      if(item.type==="numeric")
        type="number"
      let values = ""
      if(item.values){
        values = item.values.join(", ")
      }
      console.log(item.value_off,item.value_on);
      let confel = {
        name:item.name,
        address:item.property,
        low:item.value_min||item.value_off||0,
        high:item.value_max||item.value_on||10000000,
        icon:"",
        type:type,
        unit:item.unit,
        values:values,
        control:false
      }
      conf.push(confel)
    }
    form.show("LinkDevices",null,{
      DeviceTypeConnect: "mqtt",
      DeviceType: "other",
      DeviceAddress: data.allAddress,
      DeviceValueType: "json",
      DeviceConfig: conf
    })
  }

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect zigbee`}>
          <p>zigbee</p>
        </div>
        <div className = {`typeConnect zigbee`}>
          <p>{data.address}</p>
        </div>
        <RunText className="DeviceName" id={data.name} text={data.name||"NuN"}/>
      </div>
      <div className = "NewCardBody">
        <ul>
        {(data.exposes)?
          data.exposes.map((item,index)=>{
            return(
              <li className="DeviceControlLi" key={index}>
                <div className="DeviceControlLiName">
                  <p>{item.name}</p>
                </div>
                <div className="DeviceControlLiContent">
                  <div className="DeviceControlLiValue">
                    <p>{item.type}</p>
                  </div>
                </div>
              </li>
            )
          }):null
        }
        </ul>
      </div>
      <div className = "NewCardControl">
        <button className="cardControlBtn" onClick={()=>{linc()}}>linc</button>
      </div>
    </div>
  )
}
