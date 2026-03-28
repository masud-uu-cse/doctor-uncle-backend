import { Router } from 'express';
import { SymptomCheckerController } from '../controllers/symptom-checker.controller';

const router = Router();
const controller = new SymptomCheckerController();

router.post('/questions', controller.generateQuestions);
router.post('/diagnosis', controller.generateDiagnosis);

export default router;
