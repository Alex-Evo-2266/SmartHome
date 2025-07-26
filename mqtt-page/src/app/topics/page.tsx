'use client';
import RecursiveTree from '@/components/reqursivTree';
import { MessageService } from '@/lib/hooks/messageService.hook';
import {SERVICE_NAME_IN_DATA} from '@/lib/envVar'

export default function SocketClient() {

  const {messages} = MessageService(
    {dataKey:SERVICE_NAME_IN_DATA, messageType: "message_service"}, 
  )

  return (
    <div>
      <h2>WebSocket Messages</h2>
        <RecursiveTree label='mqtt' data={messages}/>
    </div>
  );
}
