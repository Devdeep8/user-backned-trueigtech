import express from 'express';
const app = express();
const PORT = 6001;
import cors from 'cors';
import { userRouter } from './routes/user.routes/route.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { connectDB } from './config/db.js';
import "./model/index.js"
app.use(express.json());
app.use(cors());


await connectDB()
// await sequelize.sync(); // now tables are created

await connectRabbitMQ()
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});