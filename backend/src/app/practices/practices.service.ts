import { Injectable } from '@nestjs/common';
import { Practice, Evidence } from '../interfaces';

@Injectable()
export class PracticesService {
  private practices: Practice[] = [
    {
      id: 1,
      name: 'Test-Driven Development (TDD)',
      description: 'Writing tests before code to guide development.',
      evidenceCount: 24,
    },
    {
      id: 2,
      name: 'Continuous Integration',
      description: 'Frequently merging code changes to a shared repository.',
      evidenceCount: 18,
    },
    {
      id: 3,
      name: 'Pair Programming',
      description: 'Two programmers working together at one workstation.',
      evidenceCount: 15,
    },
    {
      id: 4,
      name: 'Agile Development',
      description: 'Iterative approach to software development.',
      evidenceCount: 32,
    },
    {
      id: 5,
      name: 'Code Reviews',
      description: 'Systematic examination of code by peers.',
      evidenceCount: 21,
    },
  ];

  private evidence: Evidence[] = [
    {
      id: 1,
      practiceId: 1,
      title: 'Impact of TDD on Software Quality',
      description: 'Study showing 40% reduction in defects when using TDD',
      source: 'IEEE Software Journal',
      year: 2022,
    },
    {
      id: 2,
      practiceId: 1,
      title: 'TDD Adoption in Industry',
      description: 'Survey of 200 companies implementing TDD',
      source: 'ACM Conference on Software Engineering',
      year: 2021,
    },
    {
      id: 3,
      practiceId: 2,
      title: 'CI/CD Pipeline Efficiency',
      description: 'Research on deployment frequency improvements with CI',
      source: 'DevOps Research and Assessment',
      year: 2023,
    },
    {
      id: 4,
      practiceId: 3,
      title: 'Effectiveness of Pair Programming',
      description: 'Analysis of code quality in paired vs solo programming',
      source: 'Journal of Software Engineering',
      year: 2020,
    },
    {
      id: 5,
      practiceId: 4,
      title: 'Agile vs Waterfall Outcomes',
      description: 'Comparative study of project success rates',
      source: 'Project Management Institute',
      year: 2021,
    },
    {
      id: 6,
      practiceId: 5,
      title: 'Code Review Best Practices',
      description: 'Industry survey on effective code review techniques',
      source: 'Google Research',
      year: 2022,
    },
  ];

  getAllPractices(): Practice[] {
    return this.practices;
  }

  getPracticeEvidence(id: string): Evidence[] {
    const practiceId = parseInt(id, 10);
    return this.evidence.filter(e => e.practiceId === practiceId);
  }
}