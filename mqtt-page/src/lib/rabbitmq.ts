// lib/rabbitmq.ts
import amqp from 'amqplib';

export async function consumeExchange(
  exchangeName: string,
  type: 'fanout' | 'direct' | 'topic',
  onMessage: (msg: string) => void,
) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, type, { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, exchangeName, '');

  console.log("rabbitmq connect start")

  channel.consume(q.queue, (msg) => {
    if (msg?.content) {
      onMessage(msg.content.toString());
    }
  }, { noAck: true });
}
