'use client';

import { useEffect, useState } from "react";
import { MessageCallback, useSocket } from "./webSocket.hook";

const optionInit = {
    dataKey:"",
    messageType: "message_service"
}

export const MessageService = (option: {dataKey?: string, messageType?: string} = optionInit, callbacks: MessageCallback[] = []) => {
    const [messages, setMessages] = useState<any[]>([]);
    
    const {listenSocket, closeSocket} = useSocket([
        {messageType: option.messageType ?? optionInit.messageType, callback: setMqttMessage},
        ...callbacks
    ])
    
    function setMqttMessage(data: any){
        data = JSON.parse(data)
        if(option.dataKey === "" || !option.dataKey){
            setMessages(data)
        }
        else{
            const data1 = data[option.dataKey]
            setMessages(data1)
        }
    }
    
    useEffect(()=>{
        listenSocket()
        return ()=>closeSocket()
    },[listenSocket, closeSocket])

    return {
        messages
    }
}