import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Throttle } from '@nestjs/throttler';
import { response } from 'express';
import { NodeMailerService } from 'src/nodeMailer/nodeMailer.service';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeMailerService: NodeMailerService,
  ) {}

  // @Throttle({ default: { limit: 3, ttl: 6000 } }) // here m overriding the limit and duration.
  @Post('sign-up')
  async signUp(@Body() body: any) {
    try {
      const data = await this.userService.uploadData(body);
      if (data) {
        return 'Sign in Success!!';
      } else {
        return 'Failed to Sign-In! Please try again!';
      }
    } catch (err) {
      console.log(err.message);
      return 'An error occurred!';
    }
  }

  
  @Get('all-users-data')
  async callUser(){
    try {
      const result = this.userService.getAllUserData();
      return result;
    } catch (error) {
      console.log(error.message);
      return 'An error occurred!';
    }
  }
  // @Throttle({}) // here m getting the limit by default that i have defined in rate module.
  @Post('log-in')
  async logIn(@Body() body: any) {
    const isLogin = await this.userService.login(body);

    if (isLogin) {
      return { result: 'Login Successfully', token: isLogin };
      // return isLogin;
    } else {
      return 'Failed to login';
    }
  }

  // @Throttle({ default: { limit: 3, ttl: 6000 } })
  @UseGuards(AuthenticationGuard)
  @Post('verify-token')
  async tokenVerification(@Request() req: any) {
    // console.log("req::::::::::::",req.user);
    const result = await this.userService.getUserData(req);
    if (result) {
      return result;
    }
    return false;
  }
  // @Post('verify-token')
  // async tokenVerification(@Headers() header: any){
  //   console.log("header:::::::::::::",header.authorization.split(" ")[1])
  //   const token = header.authorization.split(" ")[1];
  //   const isVerified = await this.userService.verifyToken(token);
  //   return isVerified;
  // }
  @MessagePattern('xyz')
  async receiveMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    // console.log(`Pattern: ${context.getPattern()}`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    if (originalMsg) {
      console.log('Message Received From RabbitMQ');
    }
    return data;
  }

  @Post('mail-service')          
  async sendMailer(@Body() body: any) {
    const mail = this.nodeMailerService.sendMail(body.data);
    return {
      message: 'Successsss',
      mail: mail,
    };
  }

}

//sample comment from feature
 