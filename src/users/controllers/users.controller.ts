import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import CreateUserInput from '../input/createUser.input';
import { User } from '../schema/users/user.schema';
import { CurrentUser, Roles } from '../users.decorators';
import LoginInput from '../input/login.input';
import UpdateUserInput from '../input/updateUser.input';
import RolesGuard from '@vendor-app/core/guards/roles.guard';
import PaginationQuery from '@vendor-app/core/input/pagination-query.input';

@ApiTags('users')
@Controller('api')
export class UsersController {
  constructor(private readonly auth: UsersService) {}

  /**
   * Login a user using the email/password combination
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({ status: 201, description: 'user logged in.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async login(@Req() request, @Body() input: LoginInput): Promise<any> {
    return this.auth.login(request.user);
  }

  /**
   * Register a new user.
   */
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('register')
  @ApiResponse({ status: 201, description: 'user created.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async register(@Body() input: CreateUserInput): Promise<User> {
    return this.auth.registerUser(input);
  }

  /**
   * Get currently authenticated user
   * @param resp
   * @param user
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiResponse({ status: 201, description: 'current user data.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async me(@CurrentUser() user: User): Promise<{ user: User }> {
    const currentUser = await this.auth.getUser(user);
    return {
      user: currentUser,
    };
  }

  /**
   * logout currently authenticated user
   * @param resp
   * @param user
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('logout/all')
  @ApiResponse({ status: 201, description: 'logout currently loggedIn user.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async logoutAll(@CurrentUser() user: User): Promise<number> {
    return this.auth.logoutAll(user.id);
  }

  /**
   *
   * @param input
   * @returns
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller', 'buyer')
  @Get('users')
  @ApiResponse({ status: 201, description: 'get all users paginated data' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async index(@Query() input: PaginationQuery): Promise<any> {
    return this.auth.index(input);
  }

  /**
   * create user.
   */
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Post('users')
  @ApiResponse({ status: 201, description: 'user updated.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async create(@Body() input: CreateUserInput): Promise<User> {
    return this.auth.create(input);
  }

  /**
   * update user.
   */
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Patch('users/:id')
  @ApiResponse({ status: 201, description: 'user updated.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateUserInput,
  ): Promise<User> {
    return this.auth.updateUser(id, input);
  }

  /**
   * view user.
   */
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Get('users/:id')
  @ApiResponse({ status: 201, description: 'view single user.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async show(@Param('id') id: string): Promise<User> {
    return this.auth.getUserByKey('_id', id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('seller')
  @Delete('users/:id')
  @ApiResponse({ status: 201, description: 'user deleted' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async delete(@Param('id') id: string): Promise<User> {
    return this.auth.delete(id);
  }
}
