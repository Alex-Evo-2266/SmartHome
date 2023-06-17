import {useCallback, useRef} from 'react'
import { useDispatch } from 'react-redux';
import { SocketData, SocketTypes } from '../../models/socketData';
import { setDevices } from '../../../../entites/Device';

export const useSocket = () =>{
  const socket = useRef<WebSocket | null>(null);
  const timerId = useRef<number | undefined>(undefined);
  const dispatch = useDispatch()

  const connectSocket = useCallback(()=>{
    try{
      // console.log("env host: ",process.env.REACT_APP_WS_HOST);
      let path = `ws://localhost:5000/ws/base`
      // if (process.env.REACT_APP_WS_HOST)
      //   path = `ws://${process.env.REACT_APP_WS_HOST}/ws/base`
      // else
      //   path = `ws://localhost:5000/ws/base`
      socket.current = new WebSocket(path)
    }catch(e){
      console.error(e)
      setTimeout(connectSocket,500)
    }
  },[])

  const closeSocket = useCallback(()=>{
    if(socket.current)
      socket.current.close()
  },[])

  const listenSocket = useCallback(()=>{
    connectSocket()
    if(!socket.current) 
      return;
    socket.current.onopen = ()=>
    {
      console.log("socket connect socket");
      window.clearInterval(timerId.current);
      if(!socket.current) return;
      socket.current.onmessage = function(e) {
        const data: SocketData = JSON.parse(e.data);
        console.log(data);
        if(data.type === SocketTypes.DEVICE)
        {
          dispatch(setDevices(data.data)) 
        }
      }
      socket.current.onerror = closeSocket
      socket.current.onclose = () => {
        console.log("socket desconnect");
        timerId.current = window.setInterval(() => {
          listenSocket();
        }, 10000);
      };
    }
  },[closeSocket, connectSocket])

  return{
    listenSocket,
    connectSocket,
    closeSocket
  }
  
}
