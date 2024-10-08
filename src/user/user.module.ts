import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisMod } from 'src/redis/redis.module';
import { Helper } from './user.helper';
import { RabbitMQModule } from 'src/rabbitMq/rabbitmq.module';
import { JwtModule } from '@nestjs/jwt';
import { RateModule } from 'src/rateLimiter/rate.module';
import { NodeMailerModule } from 'src/nodeMailer/nodeMailer.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';
import { GoogleAuthService } from 'src/auth/google-auth.service';

@Module({
  imports: [
    JwtModule.register({
      //if u have different secret keys you don't need to define global u can skip that
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    RedisMod,
    RabbitMQModule,
    RateModule,
    NodeMailerModule,
    AuthModule,
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, Helper],
})
export class UserModule {}
