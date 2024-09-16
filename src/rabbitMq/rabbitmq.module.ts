import { Module } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([{
      name: "RABBIT_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'new_Q',
        queueOptions: {
          durable: true,
        },
        noAck: true,
      },
    }]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
