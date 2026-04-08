import express from 'express';
import { createBoard, getBoardById, deleteBoard, getAllBoard } from '../controller/board.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router = express.Router();

router.post('/create', authenticateToken, createBoard);
router.get('/:boardId', authenticateToken, getBoardById);
router.delete('/:boardId', authenticateToken, deleteBoard);
router.get('/', authenticateToken, getAllBoard);

export default router;
