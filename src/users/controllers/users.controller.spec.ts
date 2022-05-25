import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import { rootMongooseTestModule } from '../../../test/database';
import { UsersService } from '../services/users.service';
import configuration from '@vendor-app/config/index';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import LocalStrategy from '../strategies/local/local.strategy';
import { JwtStrategy } from '../strategies/jwt/jwt.strategy';

describe('UsersController', () => {
  let controller: UsersController;

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
      controllers: [UsersController],
      providers: [UsersService, LocalStrategy, JwtStrategy],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
