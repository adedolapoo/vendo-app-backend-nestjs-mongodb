import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '@vendor-app/config/index';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import { TestDataSeeder } from '../../../test/testDataSeeder';
import {
  closeInMemoryMongodConnection,
  rootMongooseTestModule,
} from '../../../test/database';
import { DepositsService } from './deposits.service';

describe('DepositsService', () => {
  let testDataSeeder: TestDataSeeder;
  let service: DepositsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModelModule,
        PassportModule,
        JwtModule.register({
          secret: configuration().jwt.secret,
          signOptions: { expiresIn: configuration().jwt.duration || '360000s' },
        }),
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [DepositsService],
    }).compile();

    service = module.get<DepositsService>(DepositsService);
    testDataSeeder = TestDataSeeder.create(module);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('testDataSeeder should be defined', () => {
    expect(testDataSeeder).toBeDefined();
  });

  describe('UserDeposit', () => {
    it('user add to deposit', async () => {
      const user = await testDataSeeder.seedUserByRole('buyer');

      const result = await service.deposit(user._id, { deposit: 50 });

      expect(result).toBeDefined();
      expect(result.deposit).toEqual(50);
    });
  });

  describe('UserDepositReset', () => {
    it('user should reset deposit', async () => {
      const user = await testDataSeeder.seedUserByRole('buyer');

      const result = await service.reset(user._id);

      expect(result).toBeDefined();
      expect(result.deposit).toEqual(0);
    });
  });

  afterEach(async () => {
    await testDataSeeder.removeAllData();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeInMemoryMongodConnection();
    await module.close();
  });
});
