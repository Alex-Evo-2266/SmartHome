import React,{useContext} from 'react'
import {RunText} from '../../runText'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const SensorElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{
  const {target} = useContext(CartEditContext)

  const getTypeField = ()=>{
    if(!data?.field?.type)return "text"
    return data.field.type
  }

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data.data,index},editBtn)
    }
  }

if(!data?.entity?.systemName){
  return null;
}
if(getTypeField()==="number"||getTypeField()==="text"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name RunTextBaseColor" id={data.title} text={data.title}/>
        <RunText className="sensor-value RunTextBaseColor" id={`${data.title}-val`} text={`${data.fieldvalue||""} ${data.field?.unit||""}`}/>
      </div>
      {
        (data.editmode&&(deleteBtn || editBtn))?
        <div className="delete-box">
        {
          (deleteBtn)?
          <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
          null
        }
        {
          (editBtn)?
          <button className="editBtn" onClick={editbtn}>
            <i className="fas fa-list i-cost"></i>
          </button>:
          null
        }
        </div>:
        null
      }
    </div>
  )
}
if(getTypeField()==="binary"){
  return(
    <div className="SensorElement">
      <div className="icon-conteiner">
        <RunText className="sensor-name RunTextBaseColor" id={data.title} text={data.title}/>
        <div className={`valueIndicator ${(data.fieldvalue==="1")?"true":"false"}`}></div>
      </div>
      {
        (data.editmode&&(deleteBtn || editBtn))?
        <div className="delete-box">
        {
          (deleteBtn)?
          <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
          null
        }
        {
          (editBtn)?
          <button className="editBtn" onClick={editbtn}>
            <i className="fas fa-list i-cost"></i>
          </button>:
          null
        }
        </div>:
        null
      }
    </div>
  )
}

return(
  <div className="SensorElement BtnElement">
    <div className="icon-conteiner">
      <RunText className="sensor-value-name RunTextBaseColor" id={data.title} text={data.title}/>
    </div>
    {
      (data.editmode&&(deleteBtn || editBtn))?
      <div className="delete-box">
      {
        (deleteBtn)?
        <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
        null
      }
      {
        (editBtn)?
        <button className="editBtn" onClick={editbtn}>
          <i className="fas fa-list i-cost"></i>
        </button>:
        null
      }
      </div>
      :null
    }
  </div>
)
}
