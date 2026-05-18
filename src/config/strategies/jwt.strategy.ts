import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppService } from '../../app.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appService: AppService) {
    // 1. Definisikan opsi di dalam variabel dengan tipe 'any' atau 'StrategyOptions'
    // Ini mendisabel pengecekan ketat TypeScript yang memicu error 'clockTolerance'
    const jwtOptions: any = {
      // Where to find the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      
      // Security Checks (Must match AppModule config)
      secretOrKey: appService.getJwt(),
      // issuer: 'auth-microservice', 
      // audience: 'my-app-web',
      
      // Clock Drift Fix (Gunakan clockTolerance dalam satuan detik)
      clockTolerance: 30 
    };

    // 2. Oper variabel tersebut ke dalam super()
    super(jwtOptions);
  }

  // This runs AFTER the token is cryptographically verified
  async validate(payload: any) {
    // The payload contains: { sub: userId, email: string, iat: number, exp: number, etc }
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // You can return anything here, and it will be attached to req.user
    return { userId: payload.sub, email: payload.email };
  }
}
