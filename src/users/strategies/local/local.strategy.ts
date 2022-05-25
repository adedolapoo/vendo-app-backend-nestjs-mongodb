import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ModuleRef } from '@nestjs/core';
import { UsersService } from '@vendor-app/users/services/users.service';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService, private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
    });
  }

  /**
   * Validate a user.
   *
   * @param request
   * @param username
   * @param password
   */
  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<any> {
    try {
      return this.userService.validateUser(username, password);
    } catch (error) {
      return {
        ...error,
      };
    }
  }
}
