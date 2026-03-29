import { Request, Response } from 'express';
import { SymptomCheckerService } from '../services/symptom-checker.service';

export class SymptomCheckerController {
  private service: SymptomCheckerService;

  constructor() {
    this.service = new SymptomCheckerService();
  }

  public generateQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { symptoms, language } = req.body;
      if (!symptoms || typeof symptoms !== 'string') {
        res.status(400).json({ error: 'Symptoms string is required in the request body.' });
        return;
      }

      const questions = await this.service.generateQuestions(symptoms, language || 'en');
      res.status(200).json({ questions });
    } catch (error: any) {
      console.error('Error generating questions:', error.message);
      res.status(500).json({ error: 'Failed to generate questions from Symptom Checker service.' });
    }
  };

  public generateDiagnosis = async (req: Request, res: Response): Promise<void> => {
    try {
      const { symptoms, answers, language } = req.body;
      if (!symptoms || typeof symptoms !== 'string') {
        res.status(400).json({ error: 'Symptoms string is required in the request body.' });
        return;
      }
      if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ error: 'Answers array is required in the request body.' });
        return;
      }

      const diagnosis = await this.service.generateDiagnosis(symptoms, answers, language || 'en');
      res.status(200).json(diagnosis);
    } catch (error: any) {
      console.error('Error generating diagnosis:', error.message);
      res.status(500).json({ error: 'Failed to generate diagnosis from Symptom Checker service.' });
    }
  };
}
