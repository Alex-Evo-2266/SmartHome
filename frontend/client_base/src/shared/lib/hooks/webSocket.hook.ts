import {useCallback, useRef} from 'react'

import {ISocketData} from '../model/webSocket';

export interface MessageCallback<T> {
  messageType: string; // Тип сообщения
  callback: (data: T) => void; // Функция callback, которая принимает любые данные
}

export const useSocket = <T>(callbacks: MessageCallback<T>[] = []) =>{
  const socket = useRef<WebSocket | null>(null);
  const timerId = useRef<number | undefined>(undefined);

  const connectSocket = useCallback(()=>{
    try{
      const path = `ws://${import.meta.env.VITE_HOST}/ws/base`
      console.log(path)
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
        const data: ISocketData = JSON.parse(e.data);
        for(const collback of callbacks){
          if(collback.messageType === data.type)
          {
            collback.callback(data.data as T)
          }
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
  },[closeSocket, connectSocket, callbacks])

  return{
    listenSocket,
    connectSocket,
    closeSocket
  }
  
}
