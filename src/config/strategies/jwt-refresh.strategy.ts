// Import StrategyOptionsWithRequest
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import jwtConfig from '../namespaces/jwt.config';
import { JwtPayload } from 'src/common/types/jwt-types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@Inject(jwtConfig.KEY) jwtConf: ConfigType<typeof jwtConfig>) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.refreshSecret as string,
      passReqToCallback: true,
    };

    super(options);
  }

  // Removed 'async' to fix ESLint error because there is no 'await'
  validate(req: Request, payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const authHeader = req.get('Authorization') ?? '';
    const refreshToken = authHeader.replace(/Bearer/i, '').trim();

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
