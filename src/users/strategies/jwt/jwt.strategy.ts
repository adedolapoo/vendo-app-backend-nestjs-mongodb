import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from '@vendor-app/config/index';
import { User } from '@vendor-app/users/schema/users/user.schema';

/**
 * JWT auth strategy.
 *
 * A default value is provided for the jwt secret in case it is not available.
 * @todo use injected config
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration().jwt.secret,
      ignoreExpiration: true,
    });
  }

  /**
   * Check if JWT Token is valid
   */
  async validate(payload: User) {
    return payload;
  }
}
