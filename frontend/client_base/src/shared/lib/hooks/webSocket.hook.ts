import {useCallback, useRef} from 'react'
import {ISocketData} from '../model/webSocket';

export const useSocket = () =>{
  const socket = useRef<WebSocket | null>(null);
  const timerId = useRef<number | undefined>(undefined);

  const connectSocket = useCallback(()=>{
    try{
      let path = `ws://${import.meta.env.VITE_HOST}/ws/base`
      console.log(path)
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
    console.log('p0')
    if(!socket.current) 
      return;
    console.log('p1')
    socket.current.onopen = ()=>
    {
      console.log("socket connect socket");
      window.clearInterval(timerId.current);
      if(!socket.current) return;
      socket.current.onmessage = function(e) {
        const data: ISocketData = JSON.parse(e.data);
        console.log(data);
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
