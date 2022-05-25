import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import RolesGuard from '@vendor-app/core/guards/roles.guard';
import PaginationQuery from '@vendor-app/core/input/pagination-query.input';
import { User } from '@vendor-app/users/schema/users/user.schema';
import { CurrentUser, Roles } from '@vendor-app/users/users.decorators';
import CreateProductInput from '../input/createProduct.input';
import UpdateProductInput from '../input/updateProduct.input';
import { Product } from '../schema/products/product.schema';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly product: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller', 'buyer')
  @Get('')
  @ApiResponse({ status: 201, description: 'get all products paginated data' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async index(
    @CurrentUser() user: User,
    @Query() input: PaginationQuery,
  ): Promise<any> {
    return this.product.index(user, input);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Post('/')
  @ApiResponse({ status: 201, description: 'product created' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async create(
    @CurrentUser() user: User,
    @Body() input: CreateProductInput,
  ): Promise<Product> {
    return this.product.create(user, input);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Patch('/:id')
  @ApiResponse({ status: 201, description: 'product updated' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() input: UpdateProductInput,
  ): Promise<Product> {
    return this.product.update(user, id, input);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller', 'buyer')
  @Get('/:id')
  @ApiResponse({ status: 201, description: 'view single product data' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async show(@Param('id') id: string): Promise<Product> {
    return this.product.view(id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Delete('/:id')
  @ApiResponse({ status: 201, description: 'product deleted' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async delete(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Product> {
    return this.product.delete(user, id);
  }
}
