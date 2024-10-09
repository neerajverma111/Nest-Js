import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RedisMod } from './redis/redis.module';
import { RabbitMQModule } from './rabbitMq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    RabbitMQModule,
    // ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
