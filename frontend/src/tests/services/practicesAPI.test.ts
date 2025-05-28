import { getAllPractices, getPracticeById, submitEvidence } from '@/services/practicesAPI';

// Mock fetch
global.fetch = jest.fn();

describe('practicesAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPractices', () => {
    it('fetches all practices successfully', async () => {
      const mockData = [{ id: 1, name: 'TDD' }];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await getAllPractices();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/api/practices');
    });

    it('throws error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(getAllPractices()).rejects.toThrow();
    });
  });

  describe('getPracticeById', () => {
    it('fetches practice by id', async () => {
      const mockData = { id: 1, name: 'TDD' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await getPracticeById(1);
      expect(result).toEqual(mockData);
    });
  });

  describe('submitEvidence', () => {
    it('submits evidence successfully', async () => {
      const mockData = { success: true };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const evidenceData = { title: 'Test', year: 2023 };
      const result = await submitEvidence(1, evidenceData);
      expect(result).toEqual(mockData);
    });
  });
});