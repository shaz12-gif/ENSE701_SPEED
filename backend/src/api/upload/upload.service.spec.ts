import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UploadService', () => {
  let service: UploadService;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      exec: jest.fn()
    };

    mockModel.mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ _id: 'test-id', ...data })
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getModelToken('uploadedfile'),
          useValue: mockModel
        }
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByPracticeId', () => {
    it('should return evidence for practice ID', async () => {
      const mockEvidence = [{ _id: '1', practiceId: '1' }];
      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvidence)
      });

      const result = await service.findByPracticeId('1');
      expect(result).toEqual(mockEvidence);
      expect(mockModel.find).toHaveBeenCalledWith({ practiceId: '1' });
    });
  });
});