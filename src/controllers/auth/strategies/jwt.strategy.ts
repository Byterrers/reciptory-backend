import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';

import { AuthService } from '../../../controllers/auth/auth.service';

import { IJWTPayload } from '../../../controllers/auth/jwt-payload.interface';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: _configService.get(Configuration.JWT_SECRET)
    });
  }

  async validate(payload: IJWTPayload) {
    const { email } = payload; // payload.email?

    const existingUser = await this.authService.findUserByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('User does not exist');
    }

    return { id: payload.sub, email: payload.email };
  }
}
