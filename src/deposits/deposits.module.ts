import { Module } from '@nestjs/common';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import { DepositsController } from '@vendor-app/deposits/controllers/deposits.controller';
import { DepositsService } from '@vendor-app/deposits/services/deposits.service';

@Module({
  imports: [MongooseModelModule],
  controllers: [DepositsController],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
