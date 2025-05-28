import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { NotFoundException } from '@nestjs/common';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            saveFile: jest.fn(),
            findFileById: jest.fn(),
            findByPracticeId: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEvidenceByPractice', () => {
    it('should return evidence for practice', async () => {
      const mockEvidence = [
        { _id: '1', practiceId: '1', title: 'Test Evidence' }
      ];
      jest.spyOn(service, 'findByPracticeId').mockResolvedValue(mockEvidence as any);

      const result = await controller.getEvidenceByPractice('1');
      expect(result).toEqual(mockEvidence);
    });

    it('should throw NotFoundException when service fails', async () => {
      jest.spyOn(service, 'findByPracticeId').mockRejectedValue(new Error());

      await expect(controller.getEvidenceByPractice('999'))
        .rejects.toThrow(NotFoundException);
    });
  });
});