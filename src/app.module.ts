import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RedisMod } from './redis/redis.module';
import { RabbitMQModule } from './rabbitMq/rabbitmq.module';

@Module({
  imports: [UserModule,RabbitMQModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
