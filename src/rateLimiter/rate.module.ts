import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 600, // this time is in ms.
        limit: 10,
      },
    ]),
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }]
  
})
export class RateModule {}
