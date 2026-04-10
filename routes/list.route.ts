import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.middleware';
import { createList, getLists, deleteList, getListById, getAllList,getListsByBoardId } from '../controller/list.controller';

router.post('/create', authenticateToken, createList);
router.get('/get', authenticateToken, getLists);
router.delete('/delete/:listId', authenticateToken, deleteList);
router.get('/get/:listId', authenticateToken, getListById);
router.get('/getbyboard/:boardId', authenticateToken, getListsByBoardId);
router.get('/getall', authenticateToken, getAllList);

export default router;