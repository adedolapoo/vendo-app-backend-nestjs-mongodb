import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserInput {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}
