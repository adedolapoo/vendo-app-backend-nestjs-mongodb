import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from '@vendor-app/config/index/index';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { WinstonModule } from 'nest-winston';
import { logOptions } from '@vendor-app/config/index/log.config';
import { ProductsModule } from '@vendor-app/products/products.module';
import { UsersModule } from '@vendor-app/users/users.module';
import { DepositsModule } from '@vendor-app/deposits/deposits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().database.url, {
      connectionFactory: (connection) => {
        /**
         * apply global plugins for schema here
         */
        return connection;
      },
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    WinstonModule.forRoot(logOptions),
    UsersModule,
    DepositsModule,
    ProductsModule,
  ],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
