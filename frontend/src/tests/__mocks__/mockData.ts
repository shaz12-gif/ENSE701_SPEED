
export const mockPractices = [
  { id: 1, name: 'Test-Driven Development', description: 'TDD Practice' },
  { id: 2, name: 'Pair Programming', description: 'Pair Programming Practice' },
  { id: 3, name: 'Continuous Integration', description: 'CI Practice' }
];

export const mockEvidence = [
  {
    _id: '1',
    practiceId: '1',
    title: 'TDD Evidence',
    source: 'Research Paper',
    year: 2023,
    description: 'Evidence supporting TDD',
    filename: 'tdd.pdf'
  },
  {
    _id: '2',
    practiceId: '1',
    title: 'TDD Case Study',
    source: 'Journal Article',
    year: 2022,
    description: 'Case study on TDD implementation'
  }
];

export const mockClaims = [
  { id: 1, text: 'Improves code quality' },
  { id: 2, text: 'Reduces bugs' },
  { id: 3, text: 'Increases productivity' }
];