import React, {useContext,useState} from 'react'
import {AddControlContext} from './AddControlContext'
import {ScriptPage} from './Control/scriptPage'
import {Page2} from './Control/page2'
import {Page3Device} from './Control/page3device'
import {Page4Device} from './Control/page4device'
import {Page5Device} from './Control/page5device'
import {Page3Group} from './Control/page3group'
import {Page4Group} from './Control/page4group'
import {Page5Group} from './Control/page5group'
import {Page6} from './Control/page6'
import {ConfirmationDialog} from '../../dialogWindow/dialogType/confirmationDialog'

const cardBaseElement = [
  {
    title:"button",
    data:"button"
  },
  {
    title:"script",
    data:"script"
  },
  {
    title:"slider",
    data:"slider"
  },
  {
    title:"monitor",
    data:"sensor"
  },
  {
    title:"enum",
    data:"enum"
  },
  {
    title:"weather",
    data:"weather"
  },
  {
    title:"time",
    data:"time"
  },
  {
    title:"calendar",
    data:"date"
  }
]

const cardLineElement = [
  {
    title:"button",
    data:"button"
  },
  {
    title:"script",
    data:"script"
  },
  {
    title:"slider",
    data:"slider"
  },
  {
    title:"monitor",
    data:"sensor"
  },
  {
    title:"enum",
    data:"enum"
  },
  {
    title:"text",
    data:"text"
  },
]

const weather = {
  name:"weather",
  type:"weather",
  order:0,
  typeItem:"system",
  width:1,
  height:1
}

const time = {
  name:"time",
  type:"time",
  order:0,
  typeItem:"system",
  width:2,
  height:1
}

const date = {
  name:"date",
  type:"date",
  order:0,
  typeItem:"system",
  width:2,
  height:2
}

export const AddControl = ()=>{
  const {addControl, hide} = useContext(AddControlContext)
  const [typeChild, setTypeChild] = useState("");
  const [device, setDevice] = useState(null);
  const [action, setAction] = useState(null);
  const [field, setField] = useState(null);
  const [item, setItem] = useState("device");
  const [page, setPage] = useState(1);

  const close = ()=>{
    hide()
    setTypeChild("")
    setDevice(null)
    setField(null)
    setPage(1)
  }

  const addElement = (t)=>{
    if(addControl.OK){
      addControl.OK(t)
    }
    close()
  }

  const addScript = (data)=>({
    height: 1,
    name: data.name,
    order: 0,
    type: "script",
    typeItem: "script",
    title:'',
    width: 1
  })

  const addDevField = (data)=>({
    height: 1,
    name: device.name,
    deviceName:device.systemName,
    order: 0,
    type: typeChild,
    typeItem: item,
    width: 1,
    title:'',
    typeAction:data.name
  })

  const addDevFieldAction = (data)=>({...addDevField(field), action:data})

  if(!addControl.visible){
    return null;
  }

  if(page === 1){
    return(
      <ConfirmationDialog
      hide={close}
      text="choose the element type."
      title="add element"
      active={(data)=>{
        if(data==="weather")
          addElement(weather)
        else if(data==="time")
          addElement(time)
        else if(data==="date")
          addElement(date)
        else{
          setTypeChild(data)
          setPage(2)
        }
      }}
      activeText="NEXT"
      items={(addControl.type==="AddElement")?cardBaseElement:cardLineElement}
      />
    )
  }
  if(typeChild==="script"){
    return(
      <ScriptPage
      hide={close}
      next={(data)=>{
        addElement(addScript(data))
      }}
      back={()=>setPage(1)}
      />
    )
  }
  if(page === 2){
    return(
      <Page2
      hide={close}
      type={typeChild}
      back={()=>setPage(1)}
      next={(data)=>{
        setItem(data)
        setPage(3)
      }}
      />
    )
  }
  if(item === "device"){
    if(page === 3){
      return(
        <Page3Device
        hide={close}
        type={typeChild}
        back={()=>setPage(2)}
        next={(data)=>{
          setDevice(data)
          setPage(4)
        }}
        />
      )
    }

    if(page === 4){
      return(
        <Page4Device
        hide={close}
        type={typeChild}
        device={device}
        back={()=>setPage(3)}
        next={(data)=>{
          if(typeChild === "sensor")
            {
              setField(data)
              // addDevField(data)
              setPage(6)
            }
          else if(typeChild === "button" && data.type !== "binary"){
            setPage(5)
            setField(data)
          }
          else{
            setField(data)
            // addDevField(data)
            setPage(6)
          }
        }}
        />
      )
    }

    if(page === 5){
      return(
        <Page5Device
        next={(data)=>{
          // addDevFieldAction(data)
          setAction(data)
          setPage(6)
        }}
        hide={close}
        back={()=>setPage(4)}
        field={field}
        />
      )
    }
  }
  else{
    if(page === 3){
      return(
        <Page3Group
        hide={close}
        type={typeChild}
        back={()=>setPage(2)}
        next={(data)=>{
          setDevice(data)
          setPage(4)
        }}
        />
      )
    }

    if(page === 4){
      return(
        <Page4Group
        hide={close}
        type={typeChild}
        device={device}
        back={()=>setPage(3)}
        next={(data)=>{
          if(typeChild === "sensor")
            {
              setField(data)
              // addDevField(data)
              setPage(6)
            }
          else if(typeChild === "button" && data.type !== "binary"){
            setPage(5)
            setField(data)
          }
          else{
            setField(data)
            // addDevField(data)
            setPage(6)
          }
        }}
        />
      )
    }

    if(page === 5){
      return(
        <Page5Group
        next={(data)=>{
          // addDevFieldAction(data)
          setAction(data)
          setPage(6)
        }}
        hide={close}
        back={()=>setPage(4)}
        field={field}
        />
      )
    }
  }
  if(page === 6){
    return(
      <Page6
      next={(data)=>{
        let val
        if(action)
          val = addDevFieldAction(action)
        else
          val = addDevField(field)
        val = {...val, title: data}
        addElement(val)
      }}
      hide={close}
      back={()=>setPage(4)}
      field={field}
      />
    )
  }


  return(null)
}
