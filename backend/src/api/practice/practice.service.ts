import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Practice, PracticeDocument } from './practice.schema';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>,
  ) {}

  async findAll(): Promise<Practice[]> {
    return this.practiceModel.find().exec();
  }

  async findById(id: string): Promise<Practice> {
    return this.practiceModel.findById(id).exec();
  }

  async seed(): Promise<void> {
    // Check if there are any practices already
    const count = await this.practiceModel.countDocuments();

    if (count === 0) {
      // Create default practices if none exist
      const defaultPractices = [
        {
          name: 'Test-Driven Development',
          description: 'Writing tests before implementing the actual code',
        },
        {
          name: 'Pair Programming',
          description: 'Two programmers work together at one workstation',
        },
        {
          name: 'Continuous Integration',
          description:
            'Frequent merging of all developer code to a central repository',
        },
        {
          name: 'Code Reviews',
          description: 'Systematic examination of code by peers',
        },
        {
          name: 'Agile Development',
          description: 'Iterative approach to software development',
        },
      ];

      await this.practiceModel.insertMany(defaultPractices);
    }
  }
}
