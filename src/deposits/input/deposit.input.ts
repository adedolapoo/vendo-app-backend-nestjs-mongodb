import { IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import config from '@vendor-app/config/index';

export default class DepositInput {
  @ApiProperty()
  @IsInt()
  @IsEnum(config().depositRange, {
    message: 'The deposit can only be one of 5,10,20,50,100 coins',
  })
  deposit: number;
}
