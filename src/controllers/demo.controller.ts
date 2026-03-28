import { Request, Response } from 'express';
import { DemoService } from '../services/demo.service';

export class DemoController {
  private service: DemoService;

  constructor() {
    this.service = new DemoService();
  }

  // Use arrow functions to bind "this" properly
  public createDemo = async (req: Request, res: Response): Promise<void> => {
    try {
      const demo = await this.service.createDemo(req.body);
      res.status(201).json({ success: true, data: demo });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public getDemos = async (req: Request, res: Response): Promise<void> => {
    try {
      const demos = await this.service.getAllDemos();
      res.status(200).json({ success: true, data: demos });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };

  public getDemoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const demo = await this.service.getDemoById(id);
      if (!demo) {
        res.status(404).json({ success: false, message: 'Demo not found' });
        return;
      }
      res.status(200).json({ success: true, data: demo });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
}
