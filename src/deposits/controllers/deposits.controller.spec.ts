import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import configuration from '@vendor-app/config/index';
import { rootMongooseTestModule } from '../../../test/database';
import { DepositsService } from '../services/deposits.service';
import { DepositsController } from './deposits.controller';

describe('DepositsController', () => {
  let controller: DepositsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [DepositsController],
      providers: [DepositsService],
    }).compile();

    controller = module.get<DepositsController>(DepositsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
