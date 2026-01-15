// src/worker.js
import amqplib from "amqplib";
import { connectDB } from "../../config/db.js";
import dotenv from "dotenv";
import { userEventHandlers } from "./handler.js";

dotenv.config();

const QUEUE_NAME = "user_operations";
const MAX_RETRIES = 3; // Stop retrying after 3 failures

const startWorker = async () => {
  try {
    await connectDB();
    console.log("✅ Worker: Database Ready");

    const connection = await amqplib.connect(
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    );
    const channel = await connection.createChannel();

    // prefetch = 1 means: "Give me one message at a time. Don't give me the next one until I'm done."
    // This prevents crashing under heavy load.
    await channel.prefetch(1);

    await channel.assertQueue(QUEUE_NAME);
    console.log(`🛠 Worker: Listening on ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;
      const { type, payload } = JSON.parse(msg.content.toString());
      console.log(`📨 Worker Processing: ${type} (${payload.id})`);
      const retryCount = parseInt(msg.properties.headers["x-retry-count"] || 0);

      try {
        // Use Handler Map
        const handler = userEventHandlers[type];
        if (handler) {
          await handler(payload);
        } else {
          console.log(`⚠️ Unknown Event: ${type}`);
        }

        // ACK: Tell RabbitMQ "This message is done, give me the next one"
        channel.ack(msg);
        console.log(`✅ Worker Done: ${payload.id}`);
      } catch (error) {
        console.error(`❌ Worker Error:`, error);
        // We should requeue (nack) if it's a temporary error,
        // but here we just ack to remove it so the queue doesn't clog.
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("❌ Worker failed to start:", error);
  }
};

startWorker();
