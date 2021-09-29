import React,{useContext} from 'react'
import {FormContext} from '../../Form/formContext'
import {RunText} from '../../runText'
import {Menu} from '../../dopmenu/menu'
// import {AuthContext} from '../../../context/AuthContext.js'
// import {useHttp} from '../../../hooks/http.hook'


export const ZigbeeElement = ({data}) =>{
  // const auth = useContext(AuthContext)
  // const {loading, request} = useHttp();
  const form = useContext(FormContext)

  // const rebootStik = () => {
  //   request('/api/zigbee2mqtt/reboot', 'GET',null,{Authorization: `Bearer ${auth.token}`})
  // }

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

  function buttons() {
    let arr = [
      {
        title:"rename",
        active:()=>{}
      }
    ]
    if(data.exposes){
      arr.push({
        title:"linc",
        active:linc
      })
    }
    // if(data.type==="Coordinator"){
    //   arr.push({
    //     title:"linc",
    //     active:linc
    //   })
    //}
    return arr
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
        <Menu buttons={buttons()}/>
      </div>
      {
        (data.exposes)?
        <div className="dividers"></div>
        :null
      }
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
    </div>
  )
}
