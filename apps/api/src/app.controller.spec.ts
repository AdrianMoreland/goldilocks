import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockConfigService = { get: jest.fn().mockReturnValue(4000) };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('reports API status', () => {
      expect(appController.getStatus()).toMatchObject({ name: 'Merrion Gold API', status: 'ok' });
    });
  });
});
