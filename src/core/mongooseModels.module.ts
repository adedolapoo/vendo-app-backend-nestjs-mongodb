import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { productModels } from '@vendor-app/products/schema/products';
import { userModels } from '@vendor-app/users/schema/users';

const Models = MongooseModule.forFeature([...userModels, ...productModels]);

@Module({
  imports: [Models],
  exports: [Models],
})
export class MongooseModelModule {}
