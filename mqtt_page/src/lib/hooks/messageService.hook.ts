'use client';

import { useEffect, useState } from "react";
import { MessageCallback, useSocket } from "./webSocket.hook";
import { Obj1 } from "../models/types";

const optionInit = {
    dataKey:"",
    messageType: "message_service"
}

// const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const MessageService = (option: {dataKey?: string, messageType?: string} = optionInit, callbacks: MessageCallback[] = []) => {
    const [messages, setMessages] = useState<Obj1>({_value: ""});
    
    const {listenSocket, closeSocket} = useSocket([
        {messageType: option.messageType ?? optionInit.messageType, callback: setMqttMessage},
        ...callbacks
    ])
    
    function setMqttMessage(data: string){
        const parseData = JSON.parse(data)
        if(option.dataKey === "" || !option.dataKey){
            setMessages(parseData)
        }
        else{
            const data1 = parseData[option.dataKey]
            setMessages(data1)
        }
    }

    // async function loadLastData(){
    //     try {
    //         const res = await fetch(`${basePath}/api-castom/last-data`); // относительный путь
    //         console.log(res)
    //         const json = await res.json();
    //         if (json.data) {
    //             const result = !option.dataKey ? json.data : json.data[option.dataKey];
    //             setMessages(result);
    //         }
    //     } catch (e) {
    //         console.warn("Не удалось загрузить последние данные с сервера", e);
    //     }
    // }
    
    useEffect(()=>{
        // loadLastData()
        listenSocket()
        return ()=>closeSocket()
    },[listenSocket, closeSocket])

    return {
        messages
    }
}