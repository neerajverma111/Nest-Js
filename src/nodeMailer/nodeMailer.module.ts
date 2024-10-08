import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { NodeMailerService } from './nodeMailer.service';
config({ path: '.env' });
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST, //email host
        port: 587,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [],
  providers: [NodeMailerService],
  exports: [NodeMailerService]
})
export class NodeMailerModule {}
