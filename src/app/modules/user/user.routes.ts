import express, { Router } from 'express';
import { StudentController } from './user.controller';
const router: Router = express.Router();

router.post('/', StudentController.createUser);
router.get('/', StudentController.getUsers);
router.get('/:userId', StudentController.getUserByUserId);

export default router;
