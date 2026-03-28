import { DemoRepository } from '../repositories/demo.repository';
import { IDemo } from '../models/demo.model';

export class DemoService {
  private repository: DemoRepository;

  constructor() {
    this.repository = new DemoRepository();
  }

  async createDemo(data: { title: string; description: string }): Promise<IDemo> {
    if (!data.title || !data.description) {
      throw new Error('Title and description are required.');
    }
    return await this.repository.create(data);
  }

  async getAllDemos(): Promise<IDemo[]> {
    return await this.repository.findAll();
  }

  async getDemoById(id: string): Promise<IDemo | null> {
    return await this.repository.findById(id);
  }
}
