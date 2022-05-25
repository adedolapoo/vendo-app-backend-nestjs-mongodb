import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../services/products.service';
import { ProductsController } from './products.controller';
import configuration from '@vendor-app/config/index';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import { rootMongooseTestModule } from '../../../test/database';
import { DepositsService } from '@vendor-app/deposits/services/deposits.service';

describe('ProductsController', () => {
  let controller: ProductsController;

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
      controllers: [ProductsController],
      providers: [ProductsService, DepositsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
