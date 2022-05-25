import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, PaginateModel } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { SCHEMAS } from '@vendor-app/core/constants';
import { User } from '../schema/users/user.schema';
import CreateUserInput from '../input/createUser.input';
import UpdateUserInput from '../input/updateUser.input';
import PaginationQuery from '@vendor-app/core/input/pagination-query.input';

type UserModel<T extends Document> = PaginateModel<T>;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SCHEMAS.USER) private userModel: Model<User>,
    @InjectModel(SCHEMAS.USER)
    readonly paginatedUser: UserModel<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Get all users paginated data
   * @param user
   * @param data
   */
  async index(data: PaginationQuery): Promise<any> {
    const customLabels = {
      docs: 'nodes',
      page: 'currentPage',
      totalPages: 'pageCount',
      limit: 'perPage',
      totalDocs: 'itemCount',
    };

    const query = {};

    return await this.paginatedUser.paginate(query, {
      customLabels,
      ...data,
    });
  }

  /**
   * Validate the users credentials.
   *
   * This is useful for the login.
   *
   * @todo update the default return.
   *
   * @param email
   * @param password
   * @constructor
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
    // Check if password is correct
    if (!user) {
      throw new NotFoundException('user with this details do not exist.');
    }

    if (bcrypt.compareSync(password, user.password)) {
      if (user.isActive) {
        throw new NotFoundException(
          'There is already an active session using your account.',
        );
      }
      user.isActive = true;
      return user.save();
    }

    throw new NotFoundException(
      'Invalid Password, Please enter the correct password.',
    );
  }

  /**
   * Register a new user.
   *
   * @param payload
   */
  public async registerUser(payload: CreateUserInput): Promise<any> {
    try {
      payload.password = bcrypt.hashSync(payload.password, 10);

      const user: User = new this.userModel(payload);
      await user.save();

      return {
        userId: user._id,
        isSeller: user.role === 'seller' ? true : false,
      };
    } catch (error) {
      // @todo improve on the error handling. Return exact field with the error
      if ('code' in error && error.code === 11000) {
        return {
          message: 'The user already exists',
          code: error.code,
        };
      }
      return {
        ...error,
      };
    }
  }

  async create(input: CreateUserInput): Promise<User> {
    input.password = bcrypt.hashSync(input.password, 10);
    return this.userModel.create({
      ...input,
    });
  }

  /**
   * Sign in a new user
   *
   * @todo we should a different key for the refresh token jwt
   * @param user
   */
  async login(user: User): Promise<any> {
    const payload = {
      id: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 3000 }),
    };
  }

  /**
   * Get application roles.
   *
   * @todo Integrate with the roles guard.
   */
  async getUserByKey(key: string, value: string): Promise<any> {
    return this.userModel.findOne({ [key]: value });
  }

  /**
   * Get user
   * @param user
   */
  async getUser(user: User): Promise<User> {
    return await this.userModel.findById(user.id).select('+password');
  }

  /**
   * Get user
   * @param user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async logoutAll(id: string): Promise<number> {
    await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    return HttpStatus.OK;
  }

  async delete(_id: string): Promise<any> {
    return this.userModel.deleteOne({ _id });
  }
}
