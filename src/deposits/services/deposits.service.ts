import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SCHEMAS } from '@vendor-app/core/constants';
import { User } from '@vendor-app/users/schema/users/user.schema';
import DepositInput from '../input/deposit.input';

@Injectable()
export class DepositsService {
  constructor(@InjectModel(SCHEMAS.USER) private UserModel: Model<User>) {}

  async deposit(id: string, input: DepositInput): Promise<User> {
    const user = await this.UserModel.findById(id);
    user.deposit += input.deposit;
    return user.save();
  }

  async reset(id: string): Promise<User> {
    return this.UserModel.findByIdAndUpdate(
      id,
      { deposit: 0 },
      { new: true },
    ).exec();
  }
}
