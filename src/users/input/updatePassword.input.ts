import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class UpdatePasswordInput {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly oldPassword?: string;

  @ApiProperty()
  @IsString()
  password: string;
}
