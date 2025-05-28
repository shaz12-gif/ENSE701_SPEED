import { getAllPractices, getPracticeById } from '../../controllers/sePracticeController';

// Mock the SEPractice model
jest.mock('../../models/SEPractice', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn(),
  insertMany: jest.fn()
}));

import SEPractice from '../../models/SEPractice';

describe('SEPracticeController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllPractices', () => {
    it('should return all practices', async () => {
      const mockPractices = [
        { name: 'TDD', description: 'Test-driven development' },
        { name: 'CI', description: 'Continuous integration' }
      ];

      SEPractice.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPractices)
      });

      await getAllPractices(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockPractices
      });
    });
  });

  describe('getPracticeById', () => {
    it('should return practice by id', async () => {
      const mockPractice = { _id: '1', name: 'TDD' };
      mockReq.params = { id: '1' };

      SEPractice.findById.mockResolvedValue(mockPractice);

      await getPracticeById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPractice
      });
    });
  });
});