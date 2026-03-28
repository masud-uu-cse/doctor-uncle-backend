import { Router } from 'express';
import { DemoController } from '../controllers/demo.controller';

const router = Router();
const controller = new DemoController();

// Map routes to controller functions
router.post('/', controller.createDemo);
router.get('/', controller.getDemos);
router.get('/:id', controller.getDemoById);

export default router;
