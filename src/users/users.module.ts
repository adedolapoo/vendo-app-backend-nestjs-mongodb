import { Module } from '@nestjs/common';
import { UsersService } from '@vendor-app/users/services/users.service';
import { UsersController } from '@vendor-app/users/controllers/users.controller';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from '@vendor-app/config/index';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import LocalStrategy from './strategies/local/local.strategy';

@Module({
  imports: [
    MongooseModelModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: configuration().jwt.duration || '5184000s' },
    }),
  ],
  providers: [UsersService, LocalStrategy, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
