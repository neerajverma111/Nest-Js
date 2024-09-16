import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
// import { AuthenticationGuard } from 'src/guards/authentication.guard';

//
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Post('log-in')
  async logIn(@Body() body: any) {
    const isLogin = await this.userService.login(body);
    if (isLogin) {
      return { result: 'Login Successfully', token: isLogin };
    } else {
      return 'Failed to login';
    }
  }
  @UseGuards(AuthenticationGuard)
  @Post('verify-token')
  async tokenVerification() {}
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
}
