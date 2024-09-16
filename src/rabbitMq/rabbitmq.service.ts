import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { RabbitMQConsumerService } from './rabbitmq.consumer';
import { catchError, lastValueFrom, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBIT_SERVICE') private readonly rabbitQueue: ClientProxy,
  ) {}

  async sendMessage(pattern: string, message: any) {
    const result = this.rabbitQueue.send(pattern, message);
    console.log('[x] Sending message to Pattern:', pattern);
    return await lastValueFrom(result);
  }
}
