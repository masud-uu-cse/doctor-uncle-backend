import { DemoModel, IDemo } from '../models/demo.model';

export class DemoRepository {
  async create(data: Partial<IDemo>): Promise<IDemo> {
    const newDoc = new DemoModel(data);
    return await newDoc.save();
  }

  async findAll(): Promise<IDemo[]> {
    return await DemoModel.find({ isActive: true });
  }

  async findById(id: string): Promise<IDemo | null> {
    return await DemoModel.findById(id);
  }
}
