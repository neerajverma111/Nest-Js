import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Allow this origin
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies, headers, etc.
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'new_Q',
      queueOptions: {
        durable: true,
      },
      noAck: true,
    },
  });
  app.use(
    session({
      secret: 'your-session-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.startAllMicroservices();
  // await app.listen(3000);
  const ipAddress = '172.16.14.194';
  const port = 3000;

  app.listen(port, ipAddress, () => {
    console.log(`Server running at http://${ipAddress}:${port}`);
  });
}
bootstrap();
