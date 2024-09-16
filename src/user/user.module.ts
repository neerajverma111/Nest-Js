import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisMod } from 'src/redis/redis.module';
import { Helper } from './user.helper';
import { RabbitMQModule } from 'src/rabbitMq/rabbitmq.module';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [UserController],
  providers: [UserService, Helper],
})
export class UserModule {}
