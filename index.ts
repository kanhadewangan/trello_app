import express from 'express';
import userRoutes from './routes/user.route';
import boardRoutes from './routes/board.route';
import cardRoutes from './routes/card.route';
import testDataRoutes from './routes/test-data.route';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN 
}))

app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
app.use('/cards', cardRoutes);
app.use('/test-data', testDataRoutes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})