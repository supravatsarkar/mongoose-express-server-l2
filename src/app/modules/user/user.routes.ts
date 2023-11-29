import express, { Router } from 'express';
import { StudentController } from './user.controller';
const router: Router = express.Router();

router.post('/', StudentController.createUser);

export default router;
