// routes/userRoutes.js
import express from "express";
import { getChannel, queueName } from "../../config/rabbitmq.js";
import { toJson } from "../../helper/json.convertor.js";
import { User } from "../../model/user.model.js";
export const userRouter = express.Router();

// POST /create - Create a new user
userRouter.post("/create", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic Validation
  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  try {
    // If RabbitMQ isn't connected yet
    const channel = getChannel();

    if (!channel) {
      return res.status(503).json({ message: "Rebbit mq is connected" });
    }

    const message = toJson({
      action: "create", // <--- This tells the worker to INSERT
      data: { name, email, password, role },
    });
    // Send data to Queue

    console.log(message);

    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`✅ Sent ${name} to queue: ${queueName}`);

    res.status(202).json({
      message: "User request queued",
      data: message,
    });
  } catch (error) {
    console.error("[Route Error]", error);
    res.status(500).json({ message: "Error processing request" });
  }
});


userRouter.get("/all-users" , async(req , res) => {
    try {
        const user = await User.findAll({
    
        })
    } catch (error) {
        
    }
})