import express from 'express';
import {createCard, getCards, updateCard} from '../controller/card.controller';

const router = express.Router();

router.post('/:listId', createCard);
router.get('/:listId', getCards);
router.put('/:cardId', updateCard);

export default router;