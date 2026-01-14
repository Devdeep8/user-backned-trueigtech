import amqplib from "amqplib";

const RABBITMQ_USER = "admin";
const RABBITMQ_PASS = "admin";
const RABBITMQ_HOST = "localhost";
const RABBITMQ_PORT = "5672";

const queueName = "user_connection";

let connection;
let channel;

export const connectRabbitMQ = async () => {
  try {
    const connectionUrl = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
    connection = await amqplib.connect(connectionUrl);
    channel = await connection.createChannel();

    await channel.assertQueue(queueName);
    console.log(
      '✅ Connected to RabbitMQ and Queue "user_operations" is ready.'
    );
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error);
  }
};


export function getChannel() {
  return channel;
}

export { queueName };
