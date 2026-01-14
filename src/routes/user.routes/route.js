// routes/userRoutes.js
import express from 'express';


export const userRouter = express.Router();

// POST /create - Create a new user
userRouter.post('/create', async (req, res) => {
    const userData = req.body; // { name, email, role, etc. }

    // Basic Validation
    if (!userData.name || !userData.email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    try {

        // If RabbitMQ isn't connected yet
   

        // Send data to Queue

        console.log(`Sent to Queue: ${userData.name}`);

        res.status(202).json({
            message: "User request queued",
            data: userData
        });

    } catch (error) {
        console.error("[Route Error]", error);
        res.status(500).json({ message: "Error processing request" });
    }
});

