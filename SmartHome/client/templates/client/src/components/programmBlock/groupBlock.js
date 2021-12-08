import React,{useState,useContext} from 'react'
import {IfBlock} from './ifBlock'
import {AddScriptContext} from '../addScript/addScriptContext'
// import {ifClass,groupIfClass} from '../../../myClass.js'

export const GroupBlock = ({index,type,children,data,updata,deleteEl})=>{
const {show} = useContext(AddScriptContext)
const [blockData/*, setData*/] = useState(data)

// {type:"group" ,oper:"and",children:[],idDevice:null,action:null,value:null}

const addEl = ()=>{
  show("typeBlock",(typeblock,dataDev)=>{
    if(typeblock==="groupBlockAnd"){
      let element = blockData
      element.children.push({type:"group" ,oper:"and",children:[],systemName:null,action:null,value:null})
      updata(element,index)
    }
    else if(typeblock==="groupBlockOr"){
      let element = blockData
      element.children.push({type:"group" ,oper:"or",children:[],systemName:null,action:null,value:null})
      updata(element,index)
    }
    else if(typeblock==="deviceBlock"){
      let element = blockData
      let act = dataDev.config[0].name
      element.children.push({type:"device" ,oper:"==",systemName:dataDev.systemName,action:act,value:""})
      updata(element,index)
    }
  })
}

const devEl = (indexel)=>{
  let elements = blockData
  elements.children = elements.children.filter((_,index2)=>index2!==indexel)
  updata(elements,index)
}

const reqUpdata = (elementData,indexel)=>{
  let elements = blockData
  elements.children[indexel] = elementData
  updata(elements,index)
}

  return(
    <div className="groupBlock">
      <div className="groupBlockTop">
        <p className="textBlock">{`start of block ${type}`}</p>
        <div className="addBlock" onClick={addEl}>
          <i className="fas fa-plus"></i>
        </div>
        {
          (typeof(deleteEl)==="function")?
          <div className="deleteBlock" onClick={()=>deleteEl(index)}>
            <i className="fas fa-trash"></i>
          </div>:
          null
        }
      </div>
      <div className="groupBlockConteiner">
      {
        (blockData)?
          blockData.children.map((item,index1)=>{
            if(item.type==="group"){
              return <GroupBlock index={index1} deleteEl={devEl} updata={reqUpdata} key={index1} type={item.oper} data={item}/>
            }
            return <IfBlock key={index1} data={item} deleteEl={devEl} index={index1} updata={reqUpdata} idDevice={item.systemName}/>
          })
        :null
      }
      </div>
      <div className="groupBlockBottom">
        <p className="textBlock">end block</p>
      </div>
    </div>
  )
}
