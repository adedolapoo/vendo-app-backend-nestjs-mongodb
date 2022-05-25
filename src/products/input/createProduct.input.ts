import { IsInt, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import config from '@vendor-app/config/index';

export default class CreateProductInput {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsEnum(config().depositRange, {
    message: 'The cost can only be one of 5,10,20,50,100 coins',
  })
  cost: number;

  @ApiProperty()
  @IsInt()
  amountAvailable: number;
}
