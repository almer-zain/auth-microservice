// src/modules/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config'; // Use 'import type' for isolatedModules
import oauthConfig from 'src/config/namespaces/oauth.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(oauthConfig.KEY)
    private readonly config: ConfigType<typeof oauthConfig>,
  ) {
    super({
      clientID: config.google.clientId!,
      clientSecret: config.google.clientSecret!,
      callbackURL: config.google.callbackUrl!,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Passport callback to normalize Google profile data.
   * Removed 'async' as there are no await expressions.
   */
  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { name, emails, photos } = profile;

    const user = {
      email: emails?.[0]?.value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
    };

    done(null, user);
  }
}
