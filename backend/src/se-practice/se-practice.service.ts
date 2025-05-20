// backend/src/se-practice/se-practice.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SEPractice, SEPracticeDocument } from './se-practice.model';

@Injectable()
export class SEPracticeService {
  constructor(
    @InjectModel(SEPractice.name) private sePracticeModel: Model<SEPracticeDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    // Find all practices and populate with evidence count
    const practices = await this.sePracticeModel.find().exec();
    
    return practices.map(practice => {
      const evidenceCount = practice.evidences ? practice.evidences.length : 0;
      return {
        _id: practice._id,
        name: practice.name,
        description: practice.description,
        evidenceCount
      };
    });
  }

  async findOne(id: string): Promise<SEPractice> {
    return this.sePracticeModel.findById(id).exec();
  }

  // Method to create sample practices for testing
  async createSamples(): Promise<any> {
    // First check if there are any existing practices
    const count = await this.sePracticeModel.countDocuments();
    if (count > 0) {
      return { message: 'Sample data already exists' };
    }

    // Sample data
    const samples = [
      {
        name: 'Test-Driven Development (TDD)',
        description: 'A software development process relying on software requirements being converted to test cases before software is fully developed.',
        evidences: ['evidence1', 'evidence2', 'evidence3']
      },
      {
        name: 'Pair Programming',
        description: 'An agile software development technique in which two programmers work together at one workstation.',
        evidences: ['evidence1', 'evidence2', 'evidence3', 'evidence4']
      },
      {
        name: 'Continuous Integration',
        description: 'The practice of merging all developers working copies to a shared mainline several times a day.',
        evidences: ['evidence1', 'evidence2']
      },
      {
        name: 'Code Reviews',
        description: 'Systematic examination of computer source code intended to find and fix mistakes.',
        evidences: []
      },
      {
        name: 'Agile Methodology',
        description: 'An approach to software development under which requirements and solutions evolve through the collaborative effort.',
        evidences: ['evidence1', 'evidence2', 'evidence3', 'evidence4', 'evidence5']
      }
    ];

    // Insert the samples
    await this.sePracticeModel.insertMany(samples);
    return { message: 'Sample data created successfully', count: samples.length };
  }
}