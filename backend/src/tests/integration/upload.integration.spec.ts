import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from '../../api/upload/upload.module';

describe('Upload Integration Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test'),
        UploadModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/upload (POST)', () => {
    it('should upload evidence without file', () => {
      return request(app.getHttpServer())
        .post('/api/upload')
        .field('practiceId', '1')
        .field('claimId', '1')
        .field('supportsClaim', 'true')
        .field('title', 'Test Evidence')
        .field('source', 'Test Source')
        .field('year', '2023')
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('should upload evidence with PDF file', () => {
      return request(app.getHttpServer())
        .post('/api/upload')
        .field('practiceId', '1')
        .field('claimId', '1')
        .field('supportsClaim', 'true')
        .attach('file', Buffer.from('test pdf'), 'test.pdf')
        .expect(201);
    });
  });

  describe('/api/upload/practice/:id (GET)', () => {
    it('should return evidence for practice', () => {
      return request(app.getHttpServer())
        .get('/api/upload/practice/1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});