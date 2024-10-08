import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  providers: [GoogleStrategy, GoogleAuthService],
  exports: [PassportModule, GoogleAuthService],
})
export class AuthModule {}
