import { IsArray, IsInt, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class BuyProductInput {
  @ApiProperty()
  @IsArray()
  products: CartItem[];
}

export class CartItem {
  @ApiProperty()
  @IsMongoId({ message: 'Invalid ID specified' })
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsInt()
  quantity: number;
}
