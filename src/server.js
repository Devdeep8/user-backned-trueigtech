import express from 'express';
const app = express();
const PORT = 6001;
import cors from 'cors';
import { userRouter } from './routes/user.routes/route.js';
app.use(express.json());
app.use(cors());

// await connectDB()
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});