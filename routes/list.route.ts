import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware';
import { createList, getLists, deleteList, getListById, getAllList, getListsByBoardId, updateList, updatePosition } from '../controller/list.controller';

router.post('/create/:boardId', authenticateToken, createList);
router.get('/get', authenticateToken, getLists);
router.delete('/delete/:listId', authenticateToken, deleteList);
router.get('/get/:listId', authenticateToken, getListById);
router.get('/getbyboard/:boardId', authenticateToken, getListsByBoardId);
router.get('/getall', authenticateToken, getAllList);
router.put('/:listId', authenticateToken, updateList);
router.put('/:listId/position', authenticateToken, updatePosition);

export default router;