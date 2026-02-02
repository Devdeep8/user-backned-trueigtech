// src/utils/messageQueueClient.js
import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();


const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

class MessageQueueClient {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  // Connect once when needed
  async connect() {
    if (this.connection && this.channel) return this.channel;

    try {
      this.connection = await amqplib.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      ('✅ [MQ Client] Connected to RabbitMQ');
      return this.channel;
    } catch (error) {
      console.error('❌ [MQ Client] Connection failed:', error);
      throw error;
    }
  }

  // Publish an event
  async publish(queueName, event) {
    try {
      const channel = await this.connect();
      const content = Buffer.from(JSON.stringify(event));
      
      // Ensure queue exists (optional, good practice for producers)
      await channel.assertQueue(queueName);
      
      const sent = channel.sendToQueue(queueName, content);
      if (sent) {
        (`📤 [MQ Client] Published event "${event.type}" to ${queueName}`);
      }
    } catch (error) {
      console.error('❌ [MQ Client] Publish failed:', error);
      throw error;
    }
  }
}

// Export a single instance
export default new MessageQueueClient();