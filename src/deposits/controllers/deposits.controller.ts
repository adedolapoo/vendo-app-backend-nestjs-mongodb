import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@sentry/node';
import RolesGuard from '@vendor-app/core/guards/roles.guard';
import { CurrentUser, Roles } from '@vendor-app/users/users.decorators';
import DepositInput from '../input/deposit.input';
import { DepositsService } from '../services/deposits.service';

@ApiTags('deposit')
@Controller('api/deposit')
export class DepositsController {
  constructor(private readonly depositService: DepositsService) {}

  /**
   * deposit funds for buyer
   * @param input
   * @param user
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('buyer')
  @Post('')
  @ApiResponse({ status: 201, description: 'user add deposit.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async deposit(
    @CurrentUser() user: User,
    @Body() input: DepositInput,
  ): Promise<{ user: User }> {
    const response = await this.depositService.deposit(user.id, input);
    return {
      user: response,
    };
  }

  /**
   * buyer can reset deposit
   * @param user
   * @returns
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('buyer')
  @Get('reset')
  @ApiResponse({ status: 201, description: 'reset user deposit.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async reset(@CurrentUser() user: User): Promise<{ user: User }> {
    const response = await this.depositService.reset(user.id);
    return {
      user: response,
    };
  }
}
