import express, { Router } from 'express';
import { StudentController } from './user.controller';
const router: Router = express.Router();

router.post('/', StudentController.createUser);
router.get('/', StudentController.getUsers);
router.get('/:userId', StudentController.getUserByUserId);
router.put('/:userId', StudentController.updateSingleUserByUserId);
router.delete('/:userId', StudentController.deleteSingleUserByUserId);
router.put('/:userId/orders', StudentController.addProduct);

export default router;
