import { Router } from 'express';
import { analyzeIndustry } from '../controllers/analyzeController';

const router = Router();

router.post('/analyze', analyzeIndustry);

export default router;
