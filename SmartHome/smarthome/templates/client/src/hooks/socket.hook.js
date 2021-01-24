import React,{createContext,useContext, useState} from 'react'
import {AuthContext} from '../context/AuthContext.js'



export const SocketContext = createContext()


export const SocketState = ({children})=>{
  const {socket,userId} = useContext(AuthContext)
  const [newMessage, setNewMessage] = useState({})
  // const [devices, setDevices] = useState([])

  function saveMessage(msg) {
    if(newMessage!==msg){
      setNewMessage(msg)
    }
  }

  const terminalMessage = (message,cb)=>{
    socket.emit('terminal message',{message},data=>{
      if(typeof(cb)==="function"&&data)
        cb(data)
    })
  }
  // socket.on('server',(data)=>{
  //   if(data&&data.message==="started"){
  //     window.location.reload();
  //   }
  // })
  // socket.on('new Data Devices',(data)=>{
  //   // setDevices(data)
  //   console.log(data);
  // })
  socket.on('terminal ret message',(data)=>{
    saveMessage(data)
  })
  const joined = (room)=>{
    socket.emit('user Joined',{userId},data=>{
    })
  }

  return(
    <SocketContext.Provider value={{terminalMessage, message:newMessage,joined}}>
      {children}
    </SocketContext.Provider>
  )
}
