/**
 * Something important to note,
 *
 * This guard should always be paired with the auth guard.
 *
 * The check that is running is simple, does the user have the stated role in their array of roles.
 *
 * The above task will reduce the need for querying for a particlular user every single time.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';
import { User } from '@vendor-app/users/schema/users/user.schema';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;

    return this.matchRoles(currentUser, roles);
  }

  /**
   * We want to check if the user has matching roles.
   *
   * A user is matched on the basis of the organization and their roles within the organization.
   *
   * @todo cache the user query and speed up this process.
   */
  private matchRoles(currentUser: User, roles: string[]) {
    // Map the current user to the an array of orgIds and roles required by the guard
    const rolesPayload = roles.map((role) => ({
      role,
    }));

    // Check if the current user has any of the roles mapped from the request.
    // If yes, grant access. Else return an exception
    try {
      const check = [];

      for (let i = 0; i < rolesPayload.length; i += 1) {
        const payload: any = rolesPayload[i];

        const matches = currentUser.role === payload.role;
        check.push(matches);
      }

      return _.includes(check, true);
    } catch (e) {
      // Send to sentry
    }

    return false;
  }
}
