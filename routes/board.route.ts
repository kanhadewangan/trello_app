import express from 'express';
import { createBoard, getBoardById, deleteBoard, getAllBoard } from '../controller/board.controller';

const router = express.Router();

router.post('/', createBoard);
router.get('/:boardId', getBoardById);
router.delete('/:boardId', deleteBoard);
router.get('/', getAllBoard);

export default router;
