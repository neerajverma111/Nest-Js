import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
 
@Module({
  imports: [
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
      type: 'single'
    }),
  ],
  controllers: [],
  providers: [],
})

export class RedisMod {}
  