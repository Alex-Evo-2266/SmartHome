'use client';
import RecursiveTree from '@/components/reqursivTree';
import { MessageService } from '@/lib/hooks/messageService.hook';

export default function SocketClient() {

  const {messages} = MessageService(
    {dataKey:"MQTT_messages", messageType: "message_service"}, 
    [
      {messageType: "message_service", callback: (data)=>console.log(data)},
    ]
  )

  return (
    <div>
      <h2>WebSocket Messages</h2>
        <RecursiveTree label='mqtt' data={messages as any}/>
    </div>
  );
}
