import  {createUser, getUserByEmail, forgetPassword, changeName,loginUser} from '../controller/user.controller';
import {Router} from 'express';

const router = Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/:email', getUserByEmail);
router.put('/forget-password/:email', forgetPassword);
router.put('/change-name/:id', changeName);

export default router;