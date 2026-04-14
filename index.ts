import express from 'express';
import userRoutes from './routes/user.route';
import boardRoutes from './routes/board.route';
import cardRoutes from './routes/card.route';
import testDataRoutes from './routes/test-data.route';
import listRoutes from './routes/list.route';
import invitationRoutes from './routes/invitation.route';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}))

app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
app.use('/cards', cardRoutes);
app.use('/test-data', testDataRoutes);
app.use('/lists', listRoutes);
app.use('/groups', invitationRoutes);


app.listen(3000, '0.0.0.0', () => console.log('Server running'))
