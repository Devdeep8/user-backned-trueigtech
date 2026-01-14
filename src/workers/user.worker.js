import amqplib from "amqplib";
import { connectDB } from "../config/db.js"; // Connects to Postgres
import dotenv from "dotenv";
import { queueName } from "../config/rabbitmq.js";
import { parseMessage } from "../helper/json.convertor.js";
import { User } from "../model/user.model.js";
dotenv.config();

const RABBITMQ_USER = "admin";
const RABBITMQ_PASS = "admin";
const RABBITMQ_HOST = "localhost";
const RABBITMQ_PORT = "5672";

const startWorker = async () => {
  try {
    await connectDB();
    console.log("✅ Worker: Connected to Database");

    // 2. Connect to RabbitMQ
    // Connects to the RabbitMQ Docker container
    const connection = await amqplib.connect(
      `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`
    );
    const channel = await connection.createChannel();

    //connect to the previous queue
    await channel.assertQueue(queueName);
    console.log(`🛠 Worker: Listening on queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (!msg) return;
      try {
        const content = parseMessage(msg);
        const { action, data } = content;
        console.log(`📨 Worker received action: ${action}`);

        switch (action) {
          case "create": {
            const existingUser = await User.findOne({
              where: { email: data.email },
            });

            if (existingUser) {
              console.log(`⚠️ User with email ${data.email} already exists.`);
            } else {
              const newUser = await User.create(data);
              console.log(`✅ User Created: ${newUser.name}`);
            }
            break;
          }

          default:
            console.log(`⚠️ Unknown action: ${action}`);
        }
        channel.ack(msg);
      } catch (error) {
        console.log(" Worker Error processing message:", error);
        channel.ack(msg); // Still acknowledge to remove from queue
      }
    });
  } catch (error) {
    console.error("❌ Worker failed to start:", error);
  }
};
startWorker();