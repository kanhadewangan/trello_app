import express from 'express';
import userRoutes from './routes/user.route';
// import boardRoutes from './routes/board.route';
// import listRoutes from './routes/list.route';
// import cardRoutes from './routes/card.route';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
// app.use('/boards', boardRoutes);
// app.use('/lists', listRoutes);
// app.use('/cards', cardRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})