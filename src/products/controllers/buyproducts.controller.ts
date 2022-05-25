import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import RolesGuard from '@vendor-app/core/guards/roles.guard';
import { User } from '@vendor-app/users/schema/users/user.schema';
import { Roles, CurrentUser } from '@vendor-app/users/users.decorators';
import BuyProductInput from '../input/buyProduct.input';
import { ProductsService } from '../services/products.service';

@Controller('api/buyproducts')
export class BuyproductsController {
  constructor(private readonly product: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('buyer')
  @Post('')
  @ApiResponse({ status: 201, description: 'buy product' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async buy(
    @CurrentUser() user: User,
    @Body() input: BuyProductInput,
  ): Promise<any> {
    return this.product.buy(user, input);
  }
}
