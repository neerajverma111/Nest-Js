import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailService: MailerService) {}

  sendMail(email: any) {
    const message = 'Hii am Neeraj';
    this.mailService.sendMail({
      from: 'Neeraj <neeraj@demomailtrap.com>',
      to: `${email}`,
      subject: 'Testing Mail From NodeMailer!!',
      text: message,
    });
  }
}