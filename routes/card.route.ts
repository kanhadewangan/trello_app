import express from 'express';
import {createCard, getCards, updateCard} from '../controller/card.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router = express.Router();

router.post('/:listId',authenticateToken, createCard);
router.get('/:listId', authenticateToken, getCards);
router.put('/:cardId', authenticateToken, updateCard);

export default router;